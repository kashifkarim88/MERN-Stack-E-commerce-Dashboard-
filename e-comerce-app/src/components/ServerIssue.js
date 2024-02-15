import React from 'react'
import serverIssues from "../images/server-Issues.gif"

function ServerIssue() {
    return <>
        <div className="server-issue-wrapper">
            <h2>Internal Server Issues</h2>
            <img src={serverIssues} alt="alert.png" />
        </div>
    </>
}

export default ServerIssue