import HeaderBox from "@/components/header-box";
import RightSidebar from "@/components/right-sidebar";
import TotalBalanceBox from "@/components/total-balance-box";
import { getLoggedInUser } from "@/lib/actions/user.actions";

export default async function Home() {
    const loggedInUser = await getLoggedInUser();

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome,"
                        user={loggedInUser?.name || "Guest"}
                        subtext="Access and manage your account and transactions efficiently."
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
                user={loggedInUser}
                transactions={[]}
                banks={[{ currentBalance: 123.5 }, { currentBalance: 1250.33 }]}
            />
        </section>
    );
}
