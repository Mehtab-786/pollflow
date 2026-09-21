
1. AppRoutes + ProtectedRoutes — separate or one?

For your app, separate is fine, but not mandatory.

I'd do:

routes/
├── AppRoutes.tsx
└── ProtectedRoute.tsx

AppRoutes → defines the application's routes.

ProtectedRoute → reusable authentication guard.

Don't create ProtectedRoutes.tsx plural; ProtectedRoute.tsx is clearer because it's a component/guard.




-------------Don't create a new socket connection inside every component. Keep the connection centralized.




5. Redux vs Zustand vs Context

For your app, I would not use Redux initially.

I'd choose:

Zustand → global auth/user state

and

useState → local page state

For example:

Zustand
├── user
├── isAuthenticated
└── auth loading

useState
├── poll answers
├── current question
├── modal open/close
└── form state

Context is also perfectly capable of handling auth state, but Zustand gives you a simpler dedicated global store without the boilerplate of Redux.

So I'd go:

Zustand + useState.

Don't put API/server data into Zustand just because you can. If your app later needs serious server-state caching, that's where something like TanStack Query becomes relevant.


Yes — TanStack Form + Zod is a solid choice for this project.
----------------------------------

