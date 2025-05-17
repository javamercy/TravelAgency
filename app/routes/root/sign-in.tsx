import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Link, redirect } from "react-router";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (user.$id) return redirect("/");
  } catch (error) {
    console.error("Error during Google login:", error);
  }
}
export default function SignIn() {
  return (
    <main className="auth">
      <section className="flex-center px-6 size-full glassmorphism">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
              />
            </Link>
            <h1 className="p-28-bold text-dark-100">Tourvisto</h1>
          </header>
          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Start Your Travel Journey
            </h2>
            <p className="p-18-regular text-gray-100 text-center !leading-7">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>
          <ButtonComponent
            type="button"
            onClick={() => loginWithGoogle()}
            iconCss="e-search-icon"
            className="!w-full !h-11 button-class"
          >
            <img
              src="/assets/icons/google.svg"
              alt="Google Icon"
              className="size-5"
            />
            <span className="p-18-semibold text-white">
              Sign in with Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
}
