export default function InitialIcon(props: { initial: string }) {
  return (
    <svg height={32} width={32}>
      <circle fill="#2563EB" cx={16} cy={16} r={16} />
      <text
        fill="#fff"
        fontSize={14}
        fontWeight={"bold"}
        textAnchor={"middle"}
        x={16}
        y={20}
      >
        {props.initial}
      </text>
    </svg>
  );
}
