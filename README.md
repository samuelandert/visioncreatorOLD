# Welcome to Visioncreator


## Launch
```
npm i
npm run dev
```
npm run dev will launch all apps and packages in our turbo monorepo. The supacreator package is our supabase postgres service. It has an external dependency to docker, which needs to be installed on the system in order for 'npx supabase start' to be able to launch the supabase services. 

Now the following services are running:
- Frontend: http://127.0.0.1:3000
- API: http://127.0.0.1:9991
- Maizzle Email Template Preview: http://127.0.0.1:3001
- Supabase API Url: http://127.0.0.1:54321
- Supabase Studio: http://127.0.0.1:54323
- Inbucket (Email Inbox Simulation): http://127.0.0.1:54324
- Nango: https://127.0.0.1:3003


## After inital launch set env vars

After initial launch, when supabase is running, copy and past the env vars from our launched supacreator#package terminal. 
To display the values again run 'npx supabase status' inside of our supacreator package.

Set them in apps/app:

```
PUBLIC_BASE_URL="http://127.0.0.1:3000"
PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
PUBLIC_SUPABASE_ANON_KEY="copy-me-from-supacreator-package-terminal"
SECRET_SUPABASE_JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
SECRET_SUPABASE_SERVICE_ROLE="copy-me-from-supacreator-package-terminal"
```

Set them in apps/api:

```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE="copy-me-from-supacreator-package-terminal"
NANGO_SECRET_KEY="copy-from-nango-dev-dashboard"
NANGO_HOST=https://127.0.0.1:3003
```


## Supabase CLI

Link remote project

````
npx supabase link --project-ref "project_id"
`````

Pull schema from remote

```
npx supabase db pull --schema auth, storage
```

Local migration of schema
```
npx supabase migration up
```