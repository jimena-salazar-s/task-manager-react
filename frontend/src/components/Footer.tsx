import { FaListUl, FaCheckCircle, FaRegClock } from "react-icons/fa";

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
                <span>
                    <FaListUl className="summary-icon" />
                    Total
                </span>
                <strong>{total}</strong>
            </div>

            <div className="summary-item">
                <span>
                    <FaCheckCircle className="summary-icon completed" />
                    Completed
                </span>
                <strong>{completed}</strong>
            </div>

            <div className="summary-item">
                <span>
                    <FaRegClock className="summary-icon pending" />
                    Pending
                </span>
                <strong>{pending}</strong>
            </div>
        </aside>
    );
}

export default Footer;