import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useBlockNavigation = (shouldBlock, message) => {
  const location = useLocation();

  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message;
    };

    const handlePopState = (event) => {
      if (!window.confirm(message)) {
        event.preventDefault();
        window.history.pushState(null, '', location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldBlock, message, location.pathname]);
};

export default useBlockNavigation;