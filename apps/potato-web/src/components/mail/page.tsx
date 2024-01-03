import { Mail } from "./components/mail";
import { accounts, mails } from "./data";

export default function MailPage() {
  const layout = localStorage.getItem("react-resizable-panels:layout");
  const collapsed = localStorage.getItem("react-resizable-panels:collapsed");

  console.log(layout, collapsed);

  const defaultLayout = layout ? JSON.parse(layout) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : undefined;

  return (
    <>
      <Mail
        accounts={accounts}
        mails={mails}
        defaultLayout={defaultLayout}
        defaultCollapsed={undefined}
        navCollapsedSize={1}
      />
    </>
  );
}
