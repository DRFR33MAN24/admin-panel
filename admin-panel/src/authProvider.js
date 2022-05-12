const authProvider = {
  login: ({ username, password }) => {
    const request = new Request("http://localhost:3000/api/auth/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ token }) => {
        // store the token in local storage
        localStorage.setItem("token", token);
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },
  // ...
};
