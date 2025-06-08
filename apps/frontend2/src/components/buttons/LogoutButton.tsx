import { Button } from '@/components/ui/button'
import { persistor } from '@/store/store';
import { logout } from '@/store/slices/profileSlice';
import { useAppDispatch } from '@/store/hooks';

function LogoutButton() {

    const dispatch = useAppDispatch()
    
    const handleLogout = async () => {
        console.log('hey there',)
        localStorage.setItem("auth-token", "")
        dispatch(logout())
        await persistor.purge()
        // refresh the page
        window.location.reload();
        console.log('After')
    };


    return (
        <Button
            variant="destructive"
            size="lg"
            className="bg-[#964242] hover:bg-[#b93b3b] px-1 xl:px-2  absolute right-0 top-0 bottom-0 h-full text-xl xl:text-2xl flex items-center justify-center "
            onClick={() => handleLogout()}
        >
            ⇲
        </Button>
    )
}

export default LogoutButton

