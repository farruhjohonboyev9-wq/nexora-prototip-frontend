// Quick setup guide for frontend-backend integration
// 
// 1. Copy .env.example to .env and update with your API URL:
//    VITE_API_URL=http://localhost:3000 (for development)
//    VITE_API_URL=https://nexora-prototype-production.up.railway.app (for production)
//
// 2. Import services in your components:
//    import { projectService, taskService, authService } from '@/lib/services';
//
// 3. Use with React Query:
//    const { data: projects } = useQuery({
//      queryKey: ['projects'],
//      queryFn: () => projectService.getProjects(),
//    });
//
// 4. API automatically handles:
//    - Authentication headers (Bearer token)
//    - 401 redirects to login
//    - Error handling
//    - JSON serialization

export {};
