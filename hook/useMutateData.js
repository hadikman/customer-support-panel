import {useMutation, useQueryClient} from '@tanstack/react-query'

export default function useMutateData({
  queryKey,
  url,
  method,
  headers,
  options,
  mutationKey,
  mutationFn,
  cacheTime,
  networkMode,
  onError,
  onMutate,
  onSettled,
  onSuccess,
  retry,
  retryDelay,
  useErrorBoundary,
  meta,
}) {
  const queryClient = useQueryClient()

  const {
    data,
    error,
    isError,
    isIdle,
    isPending,
    isPaused,
    isSuccess,
    failureCount,
    failureReason,
    mutate,
    mutateAsync,
    reset,
    status,
  } = useMutation({
    mutationKey,
    mutationFn:
      mutationFn ||
      (body =>
        fetch(url, {
          method: method || 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(body),
          ...options,
        }).then(res => res.json())),
    cacheTime,
    networkMode,
    onError,
    onMutate,
    onSettled,
    onSuccess:
      onSuccess ||
      (queryKey &&
        (() => {
          queryClient.invalidateQueries({queryKey})
        })),
    retry,
    retryDelay,
    useErrorBoundary,
    meta,
  })

  return {
    data,
    error,
    isError,
    isIdle,
    isPending,
    isPaused,
    isSuccess,
    failureCount,
    failureReason,
    mutate,
    mutateAsync,
    reset,
    status,
  }
}
