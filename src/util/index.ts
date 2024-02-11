import { useLocation, useNavigate } from 'react-router-dom'

export function useRedirect() {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    return (path: string) => {
        if (pathname !== path) {
            navigate(path)
        }
    }
}
