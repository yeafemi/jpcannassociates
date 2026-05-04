import logo from "@/assets/jpcann-logo.png";

export function BrandLoader({ active }: { active: boolean }) {
  return (
    <div aria-hidden={!active} className="brand-loader" data-active={active}>
      <div className="brand-loader__stage">
        <div className="brand-loader__ring brand-loader__ring--outer" />
        <div className="brand-loader__ring brand-loader__ring--inner" />
        <div className="brand-loader__core">
          <img src={logo} alt="" className="brand-loader__logo" />
        </div>
        <div className="brand-loader__shine" />
      </div>
    </div>
  );
}
