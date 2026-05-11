import "../styles/Style.css";

export default function LandingPage() {
  return (
    <div className="landing-wrapper" style={{ paddingTop: "80px" }}>

      {/* Top dark section for the intro text */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome, Dungeon Master</h1>
          <p>
            The D&D Combat and Encounter Tracker is your ultimate digital screen. Streamline your session preparation, automate rules calculations, and run seamless tactical combat encounters without flipping through endless books.
          </p>
        </div>
      </section>

      {/* Main Parchment Area */}
      <main className="landing-parchment">
        {/* Section 1: Image Left */}
        <section className="feature-section">
          <div className="placeholder-img">
            <img 
              src="https://i.etsystatic.com/45437265/r/il/78378f/5112472854/il_570xN.5112472854_snxg.jpg" 
              alt="D&D Polyhedral Combat Dice" 
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div className="text-block">
            <h2>Combat Tracker</h2>
            <p>
              Run combat flawlessly. Track precise turn order initiative, active status conditions, spell concentration, and real-time hit point pools for both players and monsters in one unified tactical interface.
            </p>
          </div>
        </section>

        {/* Section 2: Image Right */}
        <section className="feature-section reverse">
          <div className="text-block">
            <h2>Player Characters</h2>
            <p>
              Keep your party within arm's reach. Manage hero sheets, track dynamic passive perception scores, monitor changing armor classes, and check character level thresholds to scale your threats perfectly.
            </p>
          </div>
          <div className="placeholder-img">
            <img 
              src="https://www.manticgames.com/wp-content/uploads/2020/07/orcs-1021x1024.png"
              alt="Tabletop Adventurer Miniatures" 
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
        </section>

        {/* Section 3: Full Width */}
        <section className="full-feature">
          <h2>Encounter Generation</h2>
          <p>
            Build perfectly balanced challenges. Input your party size and level to automatically calculate Challenge Rating thresholds, pull appropriate hazards from the compendium, and deploy ready-to-fight encounters instantly to your board.
          </p>
          <div className="placeholder-img wide">
            <img 
              src="https://i.ytimg.com/vi/HMZxD4tIXSM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB3bY_Q7y-DzKQIZcq4453MW8m7WQ" 
              alt="Tabletop RPG Battle Grid Map" 
              style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <span>© 2026 DND Combat and Encounter Tracker</span>
        <span>About | Team</span>
      </footer>
    </div>
  );
}