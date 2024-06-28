import React, { useState } from "react";

import HanjaAnimationPlayer from "./HanjaAnimationPlayer.jsx";
import HanjaQuizzer from "./HanjaQuizzer.jsx";

const HanjaAnimatorAndTester = ({ hanjaChar, onLoad }) => {
    const [showTest, setShowTest] = useState(false);

    return showTest ? (
        <HanjaQuizzer hanjaChar={hanjaChar} setShowTest={setShowTest} />
    ) : (
        <HanjaAnimationPlayer
            hanjaChar={hanjaChar}
            setShowTest={setShowTest}
            onLoad={onLoad}
        />
    );
};

export default HanjaAnimatorAndTester;
