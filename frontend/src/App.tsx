import { useState, useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";

import Modal from "./components/Modal";
import asyncWrapper from "./lib/asyncWrapper";
import CreateBookingSection from "./components/CreateBookingSection";
import { BookingsService } from "./services/bookings";
import { Booking, BookingResponse } from "./services/types";
import IconButton from "./components/IconButton";
import ShowMessage from "./components/SubmissionMessage";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { AxiosError } from "axios";

export default function App() {
  const [showCreateBookingModal, setShowCreateBookingModal] =
    useState<boolean>(false);
  const [finishedCreateBookingModal, setFinishedCreateBookingModal] =
    useState<boolean>(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [updatedBooking, setUpdatedBooking] = useState<boolean>(false);

  const useNewBookingForm = useForm<BookingResponse>({
    defaultValues: { date: new Date().toISOString() },
  });

  const createNewBooking = async () => {
    const data = useNewBookingForm.getValues();

    const [res, err] = await asyncWrapper(BookingsService.createBooking(data));

    if (err) {
      console.log("Error in creating Booking");
      console.error(err);
      throw err;
    }

    if (res) {
      setShowCreateBookingModal(false);
      fetchBookings();

      setFinishedCreateBookingModal(true);
      setUpdatedBooking(true);
    }
    useNewBookingForm.reset();
  };
  const fetchBookings = async () => {
    const [res, err] = await asyncWrapper<BookingResponse[], AxiosError>(
      BookingsService.getBookings()
    );

    if (err) {
      console.log("Error in fetching Booking");
      console.error(err);
      throw new Error("Error in fetching Booking");
    }

    if (res) {
      // Parse string date to Date object
      const bookings = res.map((booking) => ({
        ...booking,
        date: new Date(booking.date),
        created_at: new Date(booking.created_at),
        updated_at: new Date(booking.updated_at),
      }));

      setBookings(bookings);
    }
  };

  const deleteBooking = async (data: any) => {
    const [res, err] = await asyncWrapper(BookingsService.deleteBooking(data));

    if (err) {
      console.log("Error in deleting Booking");
      console.error(err);
      throw new Error("Error in deleting Booking");
    }
    
    if (res) {
      fetchBookings();
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="text-center">
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3">
        <p className="text-xl font-bold">Reto Luteach</p>
        <IconButton
          onClick={() => {
            setShowCreateBookingModal(true);
          }}
        >
          Crear
        </IconButton>
        <div className="text-center mx-4 space-y-2">
          <h2 className="text-xl prose prose-stone">Lista de bookings</h2>
          <div className="bg-bermuda">
            <table className="table-auto border-separate border border-secondary">
              <tr className="bg-primary">
                <th className="border border-zinc-500">Buyer</th>
                <th className="border border-zinc-500">Provider</th>
                <th className="border border-zinc-500">Date</th>
                <th className="border border-zinc-500">Time</th>
                <th className="border border-zinc-500">Duration</th>
                <th className="border border-zinc-500">Delete booking</th>       
              </tr>
              {bookings.map((booking) => {
                // TO DO: actualizar la pagina al eliminar un booking
                return (
                  <tr className="bg-bermuda" key={booking.id}>
                    <td className="border border-zinc-500">{booking.buyer}</td>
                    <td className="border border-zinc-500">{booking.provider}</td>
                    <td className="border border-zinc-500">{booking.date.toDateString()}</td>
                    <td className="border border-zinc-500">{booking.date.toTimeString()}</td>
                    <td className="border border-zinc-500">{booking.duration} minutes</td>
                    <td className="border border-zinc-500">
                    <IconButton
                      onClick={() => {
                        deleteBooking(booking);
                        setBookings(bookings);
                      }}
                    >
                      Borrar
                    </IconButton>
                    </td>
                  </tr>
                )}
              )}
            </table>
          </div>
        </div>
      </div>
      <Modal open={showCreateBookingModal} setOpen={setShowCreateBookingModal}>
        <CreateBookingSection
          useNewBookingForm={useNewBookingForm}
          createNewBooking={createNewBooking}
        >
          <div>
            <p className="font-bold text-lg">Agendar una cita</p>
          </div>
        </CreateBookingSection>
      </Modal>
      <Modal open={finishedCreateBookingModal} setOpen={setFinishedCreateBookingModal}>
        <div>
          {/*TO DO: arreglar el mensaje al hacer un booking*/}
          <button
            type="button"
            onClick={() => {
                setFinishedCreateBookingModal(false);
                setUpdatedBooking(false);
              }
            }
            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"  
          >
            <span className="sr-only">Cerrar</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <ShowMessage
            operationResult={updatedBooking}
          >
          </ShowMessage>
        </div>
      </Modal>
    </div>
  );
}
