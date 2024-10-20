const Mask = ({
  children,
  emitClick,
}: {
  children: React.ReactNode;
  emitClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={emitClick}>
      {children}
    </div>
  );
};

export default Mask;
