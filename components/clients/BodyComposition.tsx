import Image from "next/image";

interface BodyCompositionProps {
  measurements: any;
  gender: "male" | "female";
}

export default function BodyComposition({ measurements, gender }: BodyCompositionProps) {
  const bodyImage = gender === "male" ? "/male-body.png" : "/female-body.png";

  return (
    <div className="relative w-[350px] h-[600px] mx-auto">
      <Image
        src={bodyImage}
        alt="Vücut Kompozisyonu"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
      {/* Sağ Kol */}
      <div className="absolute left-[15%] top-[25%]">
        <Bubble value={measurements?.sağ_kol_yağ_oranı} />
      </div>
      {/* Sol Kol */}
      <div className="absolute right-[15%] top-[25%]">
        <Bubble value={measurements?.sol_kol_yağ_oranı} />
      </div>
      {/* Gövde */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2">
        <Bubble value={measurements?.gövde_yağ_oranı} />
      </div>
      {/* Sağ Bacak */}
      <div className="absolute left-[22%] bottom-[10%]">
        <Bubble value={measurements?.sağ_bacak_yağ_oranı} />
      </div>
      {/* Sol Bacak */}
      <div className="absolute right-[22%] bottom-[10%]">
        <Bubble value={measurements?.sol_bacak_yağ_oranı} />
      </div>
    </div>
  );
}

function Bubble({ value }: { value: number | null | undefined }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-green-600 text-white rounded-full px-4 py-2 shadow-lg text-lg font-bold">
        {value !== undefined && value !== null ? `${value}%` : "-"}
      </span>
    </div>
  );
} 