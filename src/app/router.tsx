import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type AppRoute =
  | 'home'
  | 'customize'
  | 'designs'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'not-found';

interface RouterContextType {
  route: AppRoute;
  params: Record<string, string>;
  searchParams: URLSearchParams;
  navigate: (path: string) => void;
  currentPath: string;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parsePath(pathname: string): { route: AppRoute; params: Record<string, string> } {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean === '/' || clean === '') {
    return { route: 'home', params: {} };
  }

  const customizeMatch = clean.match(/^\/customize(?:\/([^/]+))?$/);
  if (customizeMatch) {
    return {
      route: 'customize',
      params: { productId: customizeMatch[1] || 'solestudio-glide' },
    };
  }

  if (clean === '/designs') {
    return { route: 'designs', params: {} };
  }

  if (clean === '/cart') {
    return { route: 'cart', params: {} };
  }

  if (clean === '/checkout') {
    return { route: 'checkout', params: {} };
  }

  const orderMatch = clean.match(/^\/order-confirmation\/([^/]+)$/);
  if (orderMatch) {
    return {
      route: 'order-confirmation',
      params: { orderId: orderMatch[1] },
    };
  }

  return { route: 'not-found', params: {} };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      const url = new URL(path, window.location.origin);
      setCurrentPath(url.pathname);
      setSearchParams(new URLSearchParams(url.search));
      window.scrollTo(0, 0);
    }
  };

  const { route, params } = parsePath(currentPath);

  return (
    <RouterContext.Provider
      value={{
        route,
        params,
        searchParams,
        navigate,
        currentPath,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}
