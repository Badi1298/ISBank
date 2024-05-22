import HeaderBox from "@/components/header-box";
import RightSidebar from "@/components/right-sidebar";
import TotalBalanceBox from "@/components/total-balance-box";

export default function Home() {
    const loggedIn = {
        firstName: "Ioana",
        lastName: "David",
        email: "ioanadavid@isbank.com",
    };

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome,"
                        user={loggedIn?.firstName || "Guest"}
                        subtext="Access and manage your account and transactions efficiently"
                    />

                    <TotalBalanceBox
                        accounts={[]}
                        totalBanks={1}
                        totalCurrentBalance={1250.35}
                    />
                </header>
                RECENT TRANSACTIONS
            </div>

            <RightSidebar
                user={loggedIn}
                transactions={[]}
                banks={[{ currentBalance: 123.5 }, { currentBalance: 1250.33 }]}
            />
        </section>
    );
}
