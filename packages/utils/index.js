export function isEmailValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function needsHandle(profile) {
  return !profile || !profile.handle;
}