import { useState, useEffect } from "react";
import styles from "./Profile.module.css";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    console.log("Submitted:", {
      email,
      password,
      newPassword,
      oldPassword,
    });

    setShowPopup(false);
  };
  useEffect(() => {
    document.title = "Profile - Fun Games";
  }, []);
  return (
    <div className={styles.container}>
      <a href="/" className={styles.goBackLink}>
        &#8592; Go Back
      </a>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowPopup(true);
        }}
        className={styles.form}
      >
        <h2 className={styles.title}>Profile Settings</h2>

        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Current Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className={styles.input}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.modifyButton}>
          Modify
        </button>
      </form>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <form onSubmit={handleSubmit} className={styles.popup}>
            <h3 className={styles.popupTitle}>Confirm Changes</h3>

            <input
              type="password"
              placeholder="Old Password"
              className={styles.input}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" className={styles.confirmButton}>
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
