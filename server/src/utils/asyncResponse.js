export function createResponse(message, data = {}) {
  return {
    success: true,
    message,
    ...data,
  };
}
