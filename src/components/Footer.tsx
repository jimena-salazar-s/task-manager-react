type FooterProps = {
    total: number;
    completed: number;
    pending: number;
};

function Footer({ total, completed, pending }: FooterProps) {
    return (
        <aside className="summary-panel">
            <h3>Task Summary</h3>

            <div className="summary-item">
                <span>📝 Total</span>
                <strong>{total}</strong>
            </div>

            <div className="summary-item">
                <span>✅ Completed</span>
                <strong>{completed}</strong>
            </div>

            <div className="summary-item">
                <span>⏳ Pending</span>
                <strong>{pending}</strong>
            </div>
        </aside>
    );
}

export default Footer;