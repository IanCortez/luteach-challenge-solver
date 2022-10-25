
export default function ShowMessage(operationResult: any) {
  console.log(operationResult);
  return (
    <div className="text-center">
        {(operationResult) ? (
              <p className="text-xl font-bold"> Booking succesful! </p>
          ) : (
            <p className="text-xl font-bold"> Booking unsuccesful </p>
          )
        }
    </div>
  );
};
