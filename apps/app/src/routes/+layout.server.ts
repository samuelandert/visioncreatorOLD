import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ url, locals: { safeGetSession } }) => {
  const { session, user } = await safeGetSession();

  return {
    session,
    user,
    url: url.origin
  };
}