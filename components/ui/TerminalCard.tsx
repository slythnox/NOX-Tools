import React from 'react';
import './TerminalCard.css';

export const TerminalCard: React.FC = () => {
  return (
    <div className="terminal-container">
      <div className="terminal_toolbar">
        <div className="butt">
          <button className="btn btn-color" />
          <button className="btn" />
          <button className="btn" />
        </div>
        <p className="user">johndoe@admin: ~</p>
        <div className="add_tab">
          +
        </div>
      </div>
      <div className="terminal_body">
        <div className="terminal_promt">
          <span className="terminal_user">johndoe@admin:</span>
          <span className="terminal_location">~</span>
          <span className="terminal_bling">$</span>
          <span className="terminal_cursor" />
        </div>
      </div>
    </div>
  );
}

export default TerminalCard;
