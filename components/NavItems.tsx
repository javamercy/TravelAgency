import { cn } from "lib/utils";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { logout } from "~/appwrite/auth";
import { sidebarItems } from "~/constants";

export default function NavItems({
  handleClick,
}: {
  handleClick?: () => void;
}) {
  const user = useLoaderData();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/sign-in");
  }
  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
        <h1>Tourvisto</h1>
      </Link>
      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink to={href} key={id} onClick={handleClick}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                >
                  <img
                    src={icon}
                    alt="label"
                    className={`group-hover:brightness-0 size-0 group-hover:invert ${
                      isActive ? "brightness-0 invert" : "text-dark-200"
                    }`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <footer className="nav-footer">
          <img
            src={user.imageUrl}
            alt={user.firstName}
            referrerPolicy="no-referrer"
          />
          <article>
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <p>{user.email}</p>
          </article>
          <button className="cursor-pointer" onClick={handleLogout}>
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </section>
  );
}
