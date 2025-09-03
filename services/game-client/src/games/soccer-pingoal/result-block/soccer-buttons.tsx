import styles from "./soccer-plate.module.scss";
import Image from "next/image";

export const SoccerPinGoalButtons = ({
    buttonsPosition,
    buttonsValue,
    size,
}: {
    buttonsPosition: Array<{ x: number; y: number }>;
    buttonsValue: boolean[];
    size: number;
}) => {
    return (
        <div className={styles["buttons-container"]}>
            {buttonsPosition.map((button, index) => (
                <div
                    key={index}
                    className={styles["button"]}
                    style={{
                        position: "absolute",
                        left: `${button.x}px`,
                        top: `${button.y}px`,
                        cursor: "pointer",
                        width: `${size}px`,
                        height: `${size}px`,
                    }}
                >
                    {buttonsValue[index] ? (
                        <Image src={"/static/images/soccer-pingoal/result/success.png"} alt="Success" width={size} height={size} />
                    ) : (
                        <Image src={"/static/images/soccer-pingoal/result/fail.png"} alt="Fail" width={size} height={size} />
                    )}
                </div>
            ))}
        </div>
    );
};
