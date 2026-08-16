//一旦中止
//--------
export type ModalProps = {
  showFlag: boolean;
  movieId?:string;
};

//モーダル
export default function Modal({
  showFlag,
}: ModalProps) {
  if (!showFlag) {
    return null;
  }

  return (
    <div>
      <div>
        <button>閉じる</button>
      </div>
    </div>
  );
}