import { useUser } from "@/context/UserContext";
import CarouselComponent from "../elements/Carousel";
import LagosTime from "../elements/LagosTime";
import BetSlip from "./betslip";
import { useEffect, useState } from "react";
import { Loader2, Volleyball } from "lucide-react";
import IndividualBet from "../elements/IndividualBet";
import { Bet } from "@/lib/types/bet";
import { sports } from "../../lib/data/sports";

// Interface for grouped bets
interface BetsByDate {
  [date: string]: Bet[];
}

const SectionTwo: React.FC = () => {
  const { sportsId } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Bet[] | null>(null);
  const [headerTitle, setHeaderTitle] = useState(null);

  useEffect(() => {
    const fetchOddsData = async () => {
      setLoading(true);

      const titleResult = sports.filter((sport) => {
        return sport.key == sportsId.sports_id;
      });
      setHeaderTitle(titleResult[0].description);
      try {
        const response = await fetch(`/api/odds/${sportsId.sports_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch odds data from server");
        }
        const result: Bet[] = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching odds data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sportsId) {
      fetchOddsData();
    }
  }, [sportsId]);

  // Group bets by date
  const groupBetsByDate = (bets: Bet[]): BetsByDate => {
    return bets.reduce((acc: BetsByDate, bet: Bet) => {
      const date = new Date(bet.commence_time).toLocaleString("en-US", {
        weekday: "short", // "Thu" instead of "Thursday"
        day: "numeric", // "6"
        month: "short", // "Mar"
      }); // e.g., "Thu 6 Mar"
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(bet);
      return acc;
    }, {});
  };

  const groupedBets = data ? groupBetsByDate(data) : {};

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Lagos Time */}
      <div className="p-1">
        <LagosTime />
      </div>

      <hr className="my-2 mx-4 border-gray-700" />

      <div className="flex flex-col md:flex-row h-full px-4">
        {/* Main Content - 80% width */}
        <div className="w-full md:w-2/3">
          {/* Carousel */}
          <div>
            <CarouselComponent />
          </div>

          {/* Loading Spinner */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            </div>
          ) : (
            <>
              {/* Bets List */}
              {data ? (
                <div className="py-2">
                  {/* Header */}
                  <div className="flex p-2 border-b border-gray-700 bg-[#424653] text-[11px]">
                    <Volleyball className="h-3 my-auto animate-bounce" />{" "}
                    {headerTitle}
                  </div>

                  {/* Grouped Bets */}
                  {Object.entries(groupedBets).map(([date, bets]) => (
                    <div key={date} className="bg-[#1f2128]">
                      <div className="flex items-center justify-between p-2 border-b border-gray-700">
                        <div className="w-4/5 text-gray-500 text-[11px]">
                          {date}
                        </div>
                        <div className="w-1/5 flex justify-end space-x-1 text-gray-500 font-semibold text-[11px]">
                          <span className="w-1/3">1</span>
                          <span className="w-1/3">X</span>
                          <span className="w-1/3">2</span>
                        </div>
                      </div>
                      <div className="space-y-[2px]">
                        {bets.map((bet) => (
                          <IndividualBet key={bet.id} bet={bet} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-10">
                  Loading ...
                </div>
              )}
            </>
          )}
        </div>

        {/* BetSlip - 20% width */}
        <div className="w-full md:w-1/3 mt-6 md:mt-0 md:ml-4">
          <BetSlip />
        </div>
      </div>
    </div>
  );
};

export default SectionTwo;
