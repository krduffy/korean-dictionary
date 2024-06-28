import React, { useState } from "react";

import HanjaAnimationPlayer from "./HanjaAnimationPlayer.jsx";
import HanjaQuizzer from "./HanjaQuizzer.jsx";

const HanjaAnimatorAndTester = ({ hanjaChar }) => {
    const [showTest, setShowTest] = useState(false);

    return showTest ? (
        <HanjaQuizzer hanjaChar={hanjaChar} setShowTest={setShowTest} />
    ) : (
        <HanjaAnimationPlayer hanjaChar={hanjaChar} setShowTest={setShowTest} />
    );
};

export default HanjaAnimatorAndTester;
