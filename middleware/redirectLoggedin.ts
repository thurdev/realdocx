export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession();

  // redirect the user to the dashboard screen if they're authenticated
  if (loggedIn.value) {
    return navigateTo("/cpcv/contacts");
  }
});
