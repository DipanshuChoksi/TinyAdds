import type { ReactNode } from "react";

const IMG = "https://html.aqlova.com/listbnb-prv/listbnb/assets/img/login/thumb-1-1.png";

type Props = {
  badge: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Register: wider card, no side image. */
  wide?: boolean;
};

/** Shared card layout for login / register / forgot-password pages. */
export default function AuthShell({ badge, title, subtitle, children, footer, wide }: Props) {
  return (
    <section className="lb-section lb-auth">
      <div className="container">
        <div className="row justify-content-center align-items-center g-lg-5 g-0">
          <div className={wide ? "col-xl-8 col-lg-9" : "col-lg-6 col-xl-5"}>
            <div className="lb-auth-card">
              <span className="lb-badge">{badge}</span>
              <h2 className="lb-auth-title">{title}</h2>
              {subtitle && <p className="lb-auth-sub">{subtitle}</p>}
              {children}
              {footer && <p className="lb-auth-switch">{footer}</p>}
            </div>
          </div>
          {!wide && (
            <div className="col-lg-6 d-none d-lg-block">
              <div className="lb-auth-media">
                <span className="lb-blob lb-blob-1" aria-hidden="true"></span>
                <span className="lb-blob lb-blob-2" aria-hidden="true"></span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG} alt="" loading="lazy" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
