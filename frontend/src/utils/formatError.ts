import { AxiosError } from 'axios';

export const formatError = (error: Error) => {
  if (error instanceof AxiosError) {
    return (
      ((error as AxiosError).response?.data as { message: string }).message ||
      error.message
    );
  } else {
    return (error as Error).message;
  }
};
