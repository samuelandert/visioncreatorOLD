// coreServices.ts
import { client } from '$lib/wundergraph';
import { getComposerStore } from './composerStores';
import { get } from 'svelte/store';
import { Me, emitEvent, log } from '$lib/stores';

export const coreServices = {
    mutateStore: (storeID: string, value: any) => {
        const store = getComposerStore(storeID);
        store.update(storeData => {
            storeData.store = { ...storeData.store, ...value };
            return storeData;
        });
    },
    subscribeData: (storeID: string) => {
        const store = getComposerStore(storeID);
        return store;
    },
    testAlert: () => {
        alert("core service alert")
    },
    submitUserForm: async (formData: any) => {
        console.log("User form submitted with data:", formData);
        const userId = get(Me).id;

        if (!userId) {
            throw new Error("User ID not found in Me store");
        }

        try {
            const result = await client.mutate({
                operationName: "updateMe",
                input: {
                    id: userId,
                    full_name: formData.full_name
                }
            });

            if (!result.data.success) {
                throw new Error(result.data.message || 'An error occurred while updating user');
            }

            console.log("Update result:", result);
            emitEvent({ type: 'updateMe', payload: result });

            return {
                success: true,
                message: result.data.message || 'User updated successfully'
            };
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },
    setupDirectDebit: async (formData: any) => {
        try {
            log('info', 'Starting Direct Debit setup');

            // Prepare customer data
            const customer = {
                given_name: formData.given_name || 'Chielo',
                family_name: formData.family_name,
                email: formData.email || 'chielo.jai@vc.earth',
                address_line1: formData.address_line1,
                city: formData.city,
                postal_code: formData.postal_code
            };

            // Create mandate
            const result = await client.mutate({
                operationName: 'CreateMandate',
                input: { customer }
            });

            if (result.error) {
                throw new Error(result.error.message || 'An error occurred while creating the mandate');
            }

            log('info', 'Flow started successfully', { flowId: result.data.flowId });

            // Initialize and open GoCardless Drop-in
            return new Promise((resolve, reject) => {
                const initializeDropin = () => {
                    if (typeof window.GoCardlessDropin !== 'undefined') {
                        const dropinHandler = window.GoCardlessDropin.create({
                            billingRequestFlowID: result.data.flowId,
                            environment: 'sandbox',
                            onSuccess: async (billingRequest, billingRequestFlow) => {
                                log('success', 'GoCardless Drop-in successful', { billingRequest, billingRequestFlow });
                                console.log('Success:', billingRequest, billingRequestFlow);
                                emitEvent({ type: 'mandateCreated', payload: { billingRequest, billingRequestFlow } });
                                resolve({ success: true, message: 'Mandate created successfully' });
                            },
                            onExit: async (err) => {
                                if (err) {
                                    log('error', 'Error during GoCardless process', { error: err.message });
                                    console.error('Error during GoCardless process:', err);
                                    emitEvent({ type: 'mandateError', payload: { error: err.message } });
                                    reject(new Error('An error occurred during the process: ' + err.message));
                                } else {
                                    log('info', 'GoCardless Drop-in exited without error');
                                    emitEvent({ type: 'mandateExited' });
                                    resolve({ success: false, message: 'Process exited without completing' });
                                }
                            }
                        });
                        dropinHandler.open();
                    } else {
                        setTimeout(initializeDropin, 100);
                    }
                };
                initializeDropin();
            });
        } catch (error) {
            log('error', 'Error in setupDirectDebit', { error });
            throw error;
        }
    }
};