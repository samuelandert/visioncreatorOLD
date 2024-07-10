import { PDFInvoice } from '@h1dd3nsn1p3r/pdf-invoice';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';

export const POST: RequestHandler = async ({ request }) => {
    console.log('Received request to generate invoice');
    const payload = await request.json();
    console.log('Payload received:', JSON.stringify(payload, null, 2));

    try {
        const filename = `invoice-${Date.now()}.pdf`;
        const invoicesDir = join(process.cwd(), 'invoices');
        const filePath = join(invoicesDir, filename);
        console.log('File path:', filePath);

        console.log('Creating invoices directory if it doesn\'t exist');
        await mkdir(dirname(filePath), { recursive: true });

        payload.invoice.path = filePath;
        console.log('Updated payload with file path:', JSON.stringify(payload, null, 2));

        console.log('Creating PDFInvoice instance');
        const invoice = new PDFInvoice(payload);
        console.log('Generating PDF');
        await invoice.create();
        console.log('PDF generated successfully');

        console.log('Reading PDF file');
        const pdfBuffer = await readFile(filePath);
        const base64Pdf = pdfBuffer.toString('base64');

        return json({
            pdf: base64Pdf,
            filename: filename
        });
    } catch (err) {
        console.error('Error generating PDF:', err);
        console.error('Error stack:', err.stack);
        return json({ error: 'Failed to generate PDF', details: err.message, stack: err.stack }, { status: 500 });
    }
};