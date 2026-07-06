import { FaUser } from "react-icons/fa";

type UserPanelProps = {
    userName: string;
    userEmail: string;
    onLogout: () => void;
};

export default function UserPanel({ userName, userEmail, onLogout }: UserPanelProps) {
    return (
        <div className="user-panel">
            <div className="user-info">
                <span className="user-icon-avatar">
                    <FaUser />
                </span>
                <div className="user-text">
                    <label>Active User</label>
                    <p>{userName || "Default Value"}</p>
                    <strong>{userEmail || "admin@test.com"}</strong>
                </div>
            </div>
            <button onClick={onLogout} className="logout-sidebar-button">
                LOGOUT
            </button>
        </div>
    );
}
