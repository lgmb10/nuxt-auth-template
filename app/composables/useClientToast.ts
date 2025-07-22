export function useClientToast() {
    const toast = useToast()

    function add(options: Parameters<typeof toast.add>[0]) {
        if (import.meta.client) {
            toast.add(options)
        }
    }

    function remove(id: string) {
        if (import.meta.client) {
            toast.remove(id)
        }
    }

    return { add, remove }
}
