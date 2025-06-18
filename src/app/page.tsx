import StartseiteKachel from "@/components/startseite/kachel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold underline">Skikundendialog</h1>
      <h2 className="text-2xl">was soll gemacht werden?</h2>
      <StartseiteKachel />
    </div>
  );
}
