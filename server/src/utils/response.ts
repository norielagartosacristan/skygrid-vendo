export function success(data: unknown, message = "Success") {
  return {
    success: true,
    message,
    data,
  };
}

export function failed(message: string) {
  return {
    success: false,
    message,
  };
}