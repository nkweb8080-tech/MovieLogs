import { useRef, useEffect } from "react";
import classes from "./Dialog.module.css";

type Props = {
  isOpen?: boolean;
  children: React.ReactNode;
};

export const Dialog: React.FC<Props> = ({
  isOpen = false,
  children,
}:Props): React.ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect((): void => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) {
      return;
    }
    if (isOpen) {
      if (dialogElement.hasAttribute("open")) {
        return;
      }
      dialogElement.showModal();
    } else {
      if (!dialogElement.hasAttribute("open")) {
        return;
      }
      dialogElement.close();
    }
  }, [isOpen]);

  return (
      <dialog
        className={classes["dialog"]}
        ref={dialogRef}
      >
        <div className={classes["content"]} >
          {children}
        </div>
      </dialog>
  );
};