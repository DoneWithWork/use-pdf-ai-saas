"use client";

const onNextStepComplete = async (tourName?: string | null) => {
  const res = await fetch("/api/tour", {
    method: "POST",
    body: JSON.stringify({
      firstTour: tourName === "firstTour" ? true : null,
      secondTour: tourName !== "firstTour" ? true : null,
    }),
  });
  if (!res.ok) {
    console.log("Tour error");
  }
  console.log(
    "Example onComplete Callback: NextStep Completed the tour: ",
    tourName
  );
};

const onNextStepSkip = async (step: number, tourName: string | null) => {
  const res = await fetch("/api/tour", {
    method: "POST",
    body: JSON.stringify({
      firstTour: tourName === "firstTour" ? true : null,
      secondTour: tourName !== "firstTour" ? true : null,
    }),
  });
  if (!res.ok) {
    console.log("Tour error");
  }
  console.log(
    "Example onSkip Callback: NextStep Skipped the step: ",
    step,
    "of the tour: ",
    tourName
  );
};

export { onNextStepComplete, onNextStepSkip };
