interface SkipLevelModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SkipLevelModal({ visible, onConfirm, onCancel }: SkipLevelModalProps) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Nivelul precedent nu a fost completat</h3>
        <p>Este recomandat să finalizezi nivelul anterior înainte de a trece mai departe.</p>
        <div className="modal-buttons">
          <button className="btn cancel" onClick={onCancel}>Înapoi</button>
          <button className="btn confirm" onClick={onConfirm}>Sari peste</button>
        </div>
      </div>
    </div>
  );
}
