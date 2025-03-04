import Login from "../../../page-sections/Login";
import { getMeUser } from '@utils/getMeUser';

export default async function LoginPage() {
    // await getMeUser({ validUserRedirect: '/profile' });
    return (
        <Login />
    );
}
