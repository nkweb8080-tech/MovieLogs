//中止
type ModalProps = {
  modalParams: Promise<{
    movieId?:number;
    modal?:boolean;
  }>
};

//モーダル
export default async function Modal({
  modalParams
}: ModalProps) {
  const param = await modalParams

  if (!param.modal) {
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