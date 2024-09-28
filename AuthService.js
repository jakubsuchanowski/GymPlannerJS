const AuthService = {
    saveToken: (token) => {
      localStorage.setItem('jwtToken', token);
    },
  
    getToken: () => {
      return localStorage.getItem('jwtToken');
    },
  
    logout: () => {
      localStorage.removeItem('jwtToken');
    },
  
    isAuthenticated: () => {
      return !!AuthService.getToken();
    },
  };
  
  export default AuthService;