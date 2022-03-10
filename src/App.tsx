import { useRef } from "react";
import { useSpring, animated, useSprings, config } from "react-spring";
import BillCard from "./components/Card";
import { CARDS } from "./constants/common";
import Copyright from "./components/Copyright";
import "./App.css";

const springConfig = {
  tension: 350,
  friction: 60,
  precision: 0.001,
  velocity: 0.001,
  clamp: true,
};

const POSITION_MULTIPLIER_CONFIG = {
  active: 1.8,
  before: {
    extreme: 0.1,
    rest: 0.3,
  },
  after: {
    extreme: 1.2,
    rest: 1.8,
  },
};

const CARD_STACK_MARGIN = 80;
const DURATION = 300;
const CARD_HEIGHT = 256;
const BASE_Z_INDEX = 9;

const from = (i: number) => ({
  y: -500,
  scale: 1,
  x: 0,
  rotateZ: 0,
  transformOrigin: "center",
  zIndex: i + BASE_Z_INDEX,
});

const getWrapperHeight = () => {
  let height = 0;
  if (CARDS.length > 1) {
    height = CARD_HEIGHT + CARD_STACK_MARGIN * (CARDS.length - 1);
  } else if (CARDS.length === 1) {
    height = CARD_HEIGHT;
  }
  return height;
};

function App() {
  const order = useRef(CARDS.map((_, index) => index));
  const [wrapperSpring, setWrapperSpring] = useSpring(() => ({
    height: `${getWrapperHeight()}px`,
  }));
  const [billCardSprings, setBillCardSprings] = useSprings(
    CARDS.length,
    (index) => {
      const idx = order.current.indexOf(index);
      return {
        from: { ...from(idx), y: getWrapperHeight() / 2 - CARD_HEIGHT / 2 },
        to: async (animate) => {
          await animate({
            y: idx * CARD_STACK_MARGIN,
            rotateZ: idx === CARDS.length - 1 ? -3 : idx % 2 ? -1 : 1,
            zIndex: idx + BASE_Z_INDEX,
            immediate: (key: string) => key === "zIndex",
            delay: DURATION * 0.7,
            config: { ...config.gentle },
          });
          await animate({
            y: idx * CARD_STACK_MARGIN,
            rotateZ: 0,
            zIndex: idx + BASE_Z_INDEX,
            immediate: (key: string) => key === "zIndex",
            config: { duration: DURATION * 0.1 },
          });
        },
        immediate: (key: string) => key === "zIndex",
        config: {
          duration: DURATION * 0.1,
        },
      };
    }
  );

  const resizeWrapper = () => {
    setWrapperSpring.stop();
    setWrapperSpring.start({
      from: {
        height: `${getWrapperHeight()}px`,
      },
      to: async (animate) => {
        await animate({
          height: `${getWrapperHeight() + CARD_STACK_MARGIN * 1.2}px`,
        });
        await animate({
          height: `${getWrapperHeight()}px`,
        });
      },
      config: {
        ...springConfig,
        duration: DURATION,
      },
    });
  };

  const handleOrder = (index: number) => {
    const oldOrder = [...order.current];
    const newOrder = [...order.current];
    newOrder.splice(index, 1);
    newOrder.push(order.current[index]);
    order.current = newOrder;
    return {
      oldOrder,
      newOrder,
      getOldOrderIndex: function (index: number) {
        return this.oldOrder.indexOf(index);
      },
      getNewOrderIndex: function (index: number) {
        return this.newOrder.indexOf(index);
      },
    };
  };

  const handleClick = (cardIndex: number) => {
    // click animation logic
    const index = order.current.indexOf(cardIndex);
    if (index < CARDS.length - 1) {
      const orderDetails = handleOrder(index);
      resizeWrapper();
      setBillCardSprings.stop();
      setBillCardSprings.start((itemIndex) => {
        const newIndex = orderDetails.getNewOrderIndex(itemIndex);
        const oldIndex = orderDetails.getOldOrderIndex(itemIndex);

        // clicked card
        if (oldIndex === index) {
          return {
            from: {
              y: oldIndex * CARD_STACK_MARGIN,
              rotateZ: 0,
              zIndex: oldIndex + BASE_Z_INDEX,
              config: { duration: DURATION * 0.1 },
            },
            to: async (animate: any) => {
              await animate({
                y:
                  oldIndex * CARD_STACK_MARGIN -
                  CARD_STACK_MARGIN *
                    (oldIndex === 0 ? 1 : POSITION_MULTIPLIER_CONFIG.active),
                rotateZ: 10,
                zIndex: oldIndex + BASE_Z_INDEX,
                immediate: (key: string) => key === "zIndex",
              });
              await animate({
                y: newIndex * CARD_STACK_MARGIN,
                rotateZ: 0,
                zIndex: 6 + BASE_Z_INDEX,
                config: springConfig,
                immediate: (key: string) => key === "zIndex",
              });
            },
            config: { duration: DURATION * 0.8 },
          };
        } else if (oldIndex < index) {
          return {
            from: {
              y: oldIndex * CARD_STACK_MARGIN,
              rotateZ: 0,
              zIndex: oldIndex + BASE_Z_INDEX,
            },
            to: async (animate: any) => {
              await animate({
                y:
                  oldIndex > 0
                    ? oldIndex * CARD_STACK_MARGIN + CARD_STACK_MARGIN * 0.3
                    : oldIndex * CARD_STACK_MARGIN + CARD_STACK_MARGIN * 0.1,
                rotateZ: 0,
                zIndex: newIndex + BASE_Z_INDEX,
                immediate: (key: string) => key === "zIndex",
              });
              await animate({
                y: newIndex * CARD_STACK_MARGIN,
                rotateZ: 0,
                zIndex: newIndex + BASE_Z_INDEX,
                immediate: (key: string) => key === "zIndex",
                config: springConfig,
              });
            },
            config: { duration: DURATION * 0.8 },
          };
        } else {
          let details = {
            from: {
              y: oldIndex * CARD_STACK_MARGIN,
              rotateZ: 0,
              zIndex: oldIndex + BASE_Z_INDEX,
            },
            to: async (animate: any) => {
              await animate({
                y:
                  oldIndex * CARD_STACK_MARGIN +
                  CARD_STACK_MARGIN * POSITION_MULTIPLIER_CONFIG.after.rest,
                rotateZ: 0,
                zIndex: newIndex + BASE_Z_INDEX,
                immediate: (key: string) => key === "zIndex",
              });
              await animate({
                y: newIndex * CARD_STACK_MARGIN,
                rotateZ: 0,
                zIndex: newIndex + BASE_Z_INDEX,
                immediate: (key: string) => key === "zIndex",
                config: springConfig,
              });
            },
            config: {
              duration: DURATION * 0.8,
            },
          };

          // last card in old stack
          if (oldIndex === CARDS.length - 1) {
            details = {
              from: {
                ...details.from,
              },
              to: async (animate) => {
                await animate({
                  y:
                    oldIndex * CARD_STACK_MARGIN +
                    CARD_STACK_MARGIN *
                      POSITION_MULTIPLIER_CONFIG.after.extreme,
                  rotateZ: 0,
                  zIndex: oldIndex + BASE_Z_INDEX,
                  immediate: (key: string) => key === "zIndex",
                });
                await animate({
                  y: newIndex * CARD_STACK_MARGIN,
                  rotateZ: 0,
                  zIndex: newIndex + BASE_Z_INDEX,
                  immediate: (key: string) => key === "zIndex",
                  config: springConfig,
                });
              },
              config: { duration: DURATION * 0.8 },
            };
          }
          return { ...details };
        }
      });
    }
  };

  return (
    <div className="App">
      <div className="phone-container">
        <animated.div style={wrapperSpring} className="wrapper">
          {billCardSprings.map((styles, index) => (
            <animated.div
              style={{
                ...styles,
                position: "absolute",
                width: "100%",
              }}
              onClick={() => handleClick(index)}
              key={"card-" + index}
            >
              <BillCard card={CARDS[index]} />
            </animated.div>
          ))}
        </animated.div>
      </div>
      <Copyright />
    </div>
  );
}

export default App;
