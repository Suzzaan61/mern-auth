import {Link} from "react-router-dom";

function Header() {
    return (
        <div className={'bg-slate-200'}>
            <div className={'flex justify-between items-center max-w-6xl m-auto p-3'}>
                <h1 className={'text-2xl font-bold'}>Auth App</h1>
                <ul className={'flex justify-between items-center gap-6'}>
                    <Link to={'/'}><li>Home</li></Link>
                    <Link to={'/about'}><li>About</li></Link>
                    <Link to={'/sign-in'}><li>Sign In</li></Link>
                </ul>
            </div>
        </div>
    );
}

export default Header;