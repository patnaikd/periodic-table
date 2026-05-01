import React, { useState, useMemo } from "react";

// Periodic table data — 118 elements
// Each element: { number, symbol, name, mass, category, row, col, electronConfig, electronegativity, discovered, phase, density, meltingPoint, boilingPoint, summary }
const ELEMENTS = [
  { number: 1, symbol: "H", name: "Hydrogen", mass: 1.008, category: "nonmetal", row: 1, col: 1, electronConfig: "1s¹", electronegativity: 2.20, discovered: "1766", phase: "gas", density: 0.0000899, meltingPoint: -259.16, boilingPoint: -252.87, summary: "The lightest and most abundant element in the universe; powers stars through fusion." },
  { number: 2, symbol: "He", name: "Helium", mass: 4.0026, category: "noble-gas", row: 1, col: 18, electronConfig: "1s²", electronegativity: null, discovered: "1868", phase: "gas", density: 0.0001785, meltingPoint: -272.2, boilingPoint: -268.93, summary: "A chemically inert noble gas — second most abundant in the cosmos, used to cool superconducting magnets." },
  { number: 3, symbol: "Li", name: "Lithium", mass: 6.94, category: "alkali-metal", row: 2, col: 1, electronConfig: "[He] 2s¹", electronegativity: 0.98, discovered: "1817", phase: "solid", density: 0.534, meltingPoint: 180.54, boilingPoint: 1342, summary: "The lightest metal; essential for rechargeable batteries and mood-stabilizing medication." },
  { number: 4, symbol: "Be", name: "Beryllium", mass: 9.0122, category: "alkaline-earth", row: 2, col: 2, electronConfig: "[He] 2s²", electronegativity: 1.57, discovered: "1797", phase: "solid", density: 1.85, meltingPoint: 1287, boilingPoint: 2469, summary: "Light, stiff, and toxic — used in aerospace alloys and X-ray windows." },
  { number: 5, symbol: "B", name: "Boron", mass: 10.81, category: "metalloid", row: 2, col: 13, electronConfig: "[He] 2s² 2p¹", electronegativity: 2.04, discovered: "1808", phase: "solid", density: 2.34, meltingPoint: 2076, boilingPoint: 3927, summary: "A metalloid that forms the basis of borosilicate glass and many crop nutrients." },
  { number: 6, symbol: "C", name: "Carbon", mass: 12.011, category: "nonmetal", row: 2, col: 14, electronConfig: "[He] 2s² 2p²", electronegativity: 2.55, discovered: "ancient", phase: "solid", density: 2.267, meltingPoint: 3550, boilingPoint: 4027, summary: "The backbone of all known life; forms more compounds than any other element." },
  { number: 7, symbol: "N", name: "Nitrogen", mass: 14.007, category: "nonmetal", row: 2, col: 15, electronConfig: "[He] 2s² 2p³", electronegativity: 3.04, discovered: "1772", phase: "gas", density: 0.001251, meltingPoint: -210, boilingPoint: -195.79, summary: "Makes up 78% of Earth's atmosphere; vital to amino acids and DNA." },
  { number: 8, symbol: "O", name: "Oxygen", mass: 15.999, category: "nonmetal", row: 2, col: 16, electronConfig: "[He] 2s² 2p⁴", electronegativity: 3.44, discovered: "1774", phase: "gas", density: 0.001429, meltingPoint: -218.79, boilingPoint: -182.96, summary: "Essential for respiration in most life; produced by photosynthesis." },
  { number: 9, symbol: "F", name: "Fluorine", mass: 18.998, category: "halogen", row: 2, col: 17, electronConfig: "[He] 2s² 2p⁵", electronegativity: 3.98, discovered: "1886", phase: "gas", density: 0.001696, meltingPoint: -219.67, boilingPoint: -188.11, summary: "The most electronegative element — fiercely reactive, used in toothpaste and Teflon." },
  { number: 10, symbol: "Ne", name: "Neon", mass: 20.180, category: "noble-gas", row: 2, col: 18, electronConfig: "[He] 2s² 2p⁶", electronegativity: null, discovered: "1898", phase: "gas", density: 0.0008999, meltingPoint: -248.59, boilingPoint: -246.08, summary: "Glows orange-red in electrical discharge — the namesake of neon signs." },
  { number: 11, symbol: "Na", name: "Sodium", mass: 22.990, category: "alkali-metal", row: 3, col: 1, electronConfig: "[Ne] 3s¹", electronegativity: 0.93, discovered: "1807", phase: "solid", density: 0.971, meltingPoint: 97.72, boilingPoint: 883, summary: "Soft, silvery, and explosively reactive with water; essential for nerve function." },
  { number: 12, symbol: "Mg", name: "Magnesium", mass: 24.305, category: "alkaline-earth", row: 3, col: 2, electronConfig: "[Ne] 3s²", electronegativity: 1.31, discovered: "1755", phase: "solid", density: 1.738, meltingPoint: 650, boilingPoint: 1090, summary: "Burns with a brilliant white flame; central to chlorophyll and many alloys." },
  { number: 13, symbol: "Al", name: "Aluminum", mass: 26.982, category: "post-transition", row: 3, col: 13, electronConfig: "[Ne] 3s² 3p¹", electronegativity: 1.61, discovered: "1825", phase: "solid", density: 2.698, meltingPoint: 660.32, boilingPoint: 2519, summary: "Most abundant metal in Earth's crust; light, corrosion-resistant, and infinitely recyclable." },
  { number: 14, symbol: "Si", name: "Silicon", mass: 28.085, category: "metalloid", row: 3, col: 14, electronConfig: "[Ne] 3s² 3p²", electronegativity: 1.90, discovered: "1824", phase: "solid", density: 2.3296, meltingPoint: 1414, boilingPoint: 3265, summary: "The foundation of modern electronics and the second-most abundant element in Earth's crust." },
  { number: 15, symbol: "P", name: "Phosphorus", mass: 30.974, category: "nonmetal", row: 3, col: 15, electronConfig: "[Ne] 3s² 3p³", electronegativity: 2.19, discovered: "1669", phase: "solid", density: 1.82, meltingPoint: 44.15, boilingPoint: 280.5, summary: "Glows in the dark; essential to DNA, ATP, and bones." },
  { number: 16, symbol: "S", name: "Sulfur", mass: 32.06, category: "nonmetal", row: 3, col: 16, electronConfig: "[Ne] 3s² 3p⁴", electronegativity: 2.58, discovered: "ancient", phase: "solid", density: 2.067, meltingPoint: 115.21, boilingPoint: 444.6, summary: "Yellow, brittle, and pungent — known since antiquity as brimstone." },
  { number: 17, symbol: "Cl", name: "Chlorine", mass: 35.45, category: "halogen", row: 3, col: 17, electronConfig: "[Ne] 3s² 3p⁵", electronegativity: 3.16, discovered: "1774", phase: "gas", density: 0.003214, meltingPoint: -101.5, boilingPoint: -34.04, summary: "A toxic green-yellow gas used to disinfect water and produce countless chemicals." },
  { number: 18, symbol: "Ar", name: "Argon", mass: 39.948, category: "noble-gas", row: 3, col: 18, electronConfig: "[Ne] 3s² 3p⁶", electronegativity: null, discovered: "1894", phase: "gas", density: 0.0017837, meltingPoint: -189.35, boilingPoint: -185.85, summary: "The most abundant noble gas in air; used as inert shielding in welding." },
  { number: 19, symbol: "K", name: "Potassium", mass: 39.098, category: "alkali-metal", row: 4, col: 1, electronConfig: "[Ar] 4s¹", electronegativity: 0.82, discovered: "1807", phase: "solid", density: 0.862, meltingPoint: 63.5, boilingPoint: 759, summary: "Soft and reactive; crucial for nerve impulses and plant growth." },
  { number: 20, symbol: "Ca", name: "Calcium", mass: 40.078, category: "alkaline-earth", row: 4, col: 2, electronConfig: "[Ar] 4s²", electronegativity: 1.00, discovered: "1808", phase: "solid", density: 1.54, meltingPoint: 842, boilingPoint: 1484, summary: "Builds bones, teeth, and shells; the fifth most abundant element on Earth." },
  { number: 21, symbol: "Sc", name: "Scandium", mass: 44.956, category: "transition-metal", row: 4, col: 3, electronConfig: "[Ar] 3d¹ 4s²", electronegativity: 1.36, discovered: "1879", phase: "solid", density: 2.989, meltingPoint: 1541, boilingPoint: 2836, summary: "A rare transition metal used in aerospace alloys and bright stadium lights." },
  { number: 22, symbol: "Ti", name: "Titanium", mass: 47.867, category: "transition-metal", row: 4, col: 4, electronConfig: "[Ar] 3d² 4s²", electronegativity: 1.54, discovered: "1791", phase: "solid", density: 4.54, meltingPoint: 1668, boilingPoint: 3287, summary: "Strong, light, and biocompatible — favored for implants, jets, and high-end frames." },
  { number: 23, symbol: "V", name: "Vanadium", mass: 50.942, category: "transition-metal", row: 4, col: 5, electronConfig: "[Ar] 3d³ 4s²", electronegativity: 1.63, discovered: "1801", phase: "solid", density: 6.11, meltingPoint: 1910, boilingPoint: 3407, summary: "Hardens steel and forms vividly colored compounds across multiple oxidation states." },
  { number: 24, symbol: "Cr", name: "Chromium", mass: 51.996, category: "transition-metal", row: 4, col: 6, electronConfig: "[Ar] 3d⁵ 4s¹", electronegativity: 1.66, discovered: "1797", phase: "solid", density: 7.15, meltingPoint: 1907, boilingPoint: 2671, summary: "Lustrous and corrosion-resistant; gives stainless steel its shine and rubies their red." },
  { number: 25, symbol: "Mn", name: "Manganese", mass: 54.938, category: "transition-metal", row: 4, col: 7, electronConfig: "[Ar] 3d⁵ 4s²", electronegativity: 1.55, discovered: "1774", phase: "solid", density: 7.44, meltingPoint: 1246, boilingPoint: 2061, summary: "Essential for steelmaking and for enzymes that protect cells from oxidation." },
  { number: 26, symbol: "Fe", name: "Iron", mass: 55.845, category: "transition-metal", row: 4, col: 8, electronConfig: "[Ar] 3d⁶ 4s²", electronegativity: 1.83, discovered: "ancient", phase: "solid", density: 7.874, meltingPoint: 1538, boilingPoint: 2861, summary: "Forms Earth's core, our blood's hemoglobin, and the backbone of civilization's tools." },
  { number: 27, symbol: "Co", name: "Cobalt", mass: 58.933, category: "transition-metal", row: 4, col: 9, electronConfig: "[Ar] 3d⁷ 4s²", electronegativity: 1.88, discovered: "1735", phase: "solid", density: 8.86, meltingPoint: 1495, boilingPoint: 2927, summary: "Gives glass a deep blue hue and powers lithium-ion batteries." },
  { number: 28, symbol: "Ni", name: "Nickel", mass: 58.693, category: "transition-metal", row: 4, col: 10, electronConfig: "[Ar] 3d⁸ 4s²", electronegativity: 1.91, discovered: "1751", phase: "solid", density: 8.912, meltingPoint: 1455, boilingPoint: 2913, summary: "Magnetic, ductile, and corrosion-resistant — vital to coins, batteries, and stainless steel." },
  { number: 29, symbol: "Cu", name: "Copper", mass: 63.546, category: "transition-metal", row: 4, col: 11, electronConfig: "[Ar] 3d¹⁰ 4s¹", electronegativity: 1.90, discovered: "ancient", phase: "solid", density: 8.96, meltingPoint: 1084.62, boilingPoint: 2562, summary: "Excellent conductor of heat and electricity; the first metal humans worked with extensively." },
  { number: 30, symbol: "Zn", name: "Zinc", mass: 65.38, category: "transition-metal", row: 4, col: 12, electronConfig: "[Ar] 3d¹⁰ 4s²", electronegativity: 1.65, discovered: "ancient", phase: "solid", density: 7.134, meltingPoint: 419.53, boilingPoint: 907, summary: "Galvanizes steel against rust and supports immune function in the human body." },
  { number: 31, symbol: "Ga", name: "Gallium", mass: 69.723, category: "post-transition", row: 4, col: 13, electronConfig: "[Ar] 3d¹⁰ 4s² 4p¹", electronegativity: 1.81, discovered: "1875", phase: "solid", density: 5.907, meltingPoint: 29.76, boilingPoint: 2204, summary: "Melts in your hand; key to LED and high-frequency semiconductor technology." },
  { number: 32, symbol: "Ge", name: "Germanium", mass: 72.630, category: "metalloid", row: 4, col: 14, electronConfig: "[Ar] 3d¹⁰ 4s² 4p²", electronegativity: 2.01, discovered: "1886", phase: "solid", density: 5.323, meltingPoint: 938.25, boilingPoint: 2833, summary: "Predicted by Mendeleev before its discovery; used in fiber optics and infrared optics." },
  { number: 33, symbol: "As", name: "Arsenic", mass: 74.922, category: "metalloid", row: 4, col: 15, electronConfig: "[Ar] 3d¹⁰ 4s² 4p³", electronegativity: 2.18, discovered: "ancient", phase: "solid", density: 5.776, meltingPoint: 817, boilingPoint: 614, summary: "Notoriously toxic, yet essential to certain semiconductors and historical pigments." },
  { number: 34, symbol: "Se", name: "Selenium", mass: 78.971, category: "nonmetal", row: 4, col: 16, electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁴", electronegativity: 2.55, discovered: "1817", phase: "solid", density: 4.809, meltingPoint: 221, boilingPoint: 685, summary: "Photoconductive — once used in photocopiers; trace amounts are vital to health." },
  { number: 35, symbol: "Br", name: "Bromine", mass: 79.904, category: "halogen", row: 4, col: 17, electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁵", electronegativity: 2.96, discovered: "1826", phase: "liquid", density: 3.122, meltingPoint: -7.2, boilingPoint: 58.8, summary: "One of only two liquid elements at room temperature; deep red-brown and pungent." },
  { number: 36, symbol: "Kr", name: "Krypton", mass: 83.798, category: "noble-gas", row: 4, col: 18, electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁶", electronegativity: 3.00, discovered: "1898", phase: "gas", density: 0.003733, meltingPoint: -157.36, boilingPoint: -153.22, summary: "A noble gas used in high-performance lighting and once defined the meter." },
  { number: 37, symbol: "Rb", name: "Rubidium", mass: 85.468, category: "alkali-metal", row: 5, col: 1, electronConfig: "[Kr] 5s¹", electronegativity: 0.82, discovered: "1861", phase: "solid", density: 1.532, meltingPoint: 39.31, boilingPoint: 688, summary: "So reactive it ignites in air; used in atomic clocks and specialty glasses." },
  { number: 38, symbol: "Sr", name: "Strontium", mass: 87.62, category: "alkaline-earth", row: 5, col: 2, electronConfig: "[Kr] 5s²", electronegativity: 0.95, discovered: "1790", phase: "solid", density: 2.64, meltingPoint: 777, boilingPoint: 1382, summary: "Burns red in fireworks and was once used in old cathode-ray TV glass." },
  { number: 39, symbol: "Y", name: "Yttrium", mass: 88.906, category: "transition-metal", row: 5, col: 3, electronConfig: "[Kr] 4d¹ 5s²", electronegativity: 1.22, discovered: "1794", phase: "solid", density: 4.469, meltingPoint: 1526, boilingPoint: 3336, summary: "A rare-earth metal critical to LEDs, lasers, and superconductors." },
  { number: 40, symbol: "Zr", name: "Zirconium", mass: 91.224, category: "transition-metal", row: 5, col: 4, electronConfig: "[Kr] 4d² 5s²", electronegativity: 1.33, discovered: "1789", phase: "solid", density: 6.506, meltingPoint: 1855, boilingPoint: 4409, summary: "Highly corrosion-resistant; used in nuclear reactor cladding and dental implants." },
  { number: 41, symbol: "Nb", name: "Niobium", mass: 92.906, category: "transition-metal", row: 5, col: 5, electronConfig: "[Kr] 4d⁴ 5s¹", electronegativity: 1.6, discovered: "1801", phase: "solid", density: 8.57, meltingPoint: 2477, boilingPoint: 4744, summary: "Forms superconducting alloys used in MRI magnets and particle accelerators." },
  { number: 42, symbol: "Mo", name: "Molybdenum", mass: 95.95, category: "transition-metal", row: 5, col: 6, electronConfig: "[Kr] 4d⁵ 5s¹", electronegativity: 2.16, discovered: "1781", phase: "solid", density: 10.22, meltingPoint: 2623, boilingPoint: 4639, summary: "Strengthens steel and is essential to nitrogen-fixing enzymes in plants." },
  { number: 43, symbol: "Tc", name: "Technetium", mass: 98, category: "transition-metal", row: 5, col: 7, electronConfig: "[Kr] 4d⁵ 5s²", electronegativity: 1.9, discovered: "1937", phase: "solid", density: 11.5, meltingPoint: 2157, boilingPoint: 4265, summary: "The first artificially produced element; isotopes are widely used in medical imaging." },
  { number: 44, symbol: "Ru", name: "Ruthenium", mass: 101.07, category: "transition-metal", row: 5, col: 8, electronConfig: "[Kr] 4d⁷ 5s¹", electronegativity: 2.2, discovered: "1844", phase: "solid", density: 12.37, meltingPoint: 2334, boilingPoint: 4150, summary: "A rare platinum-group metal used in electronics and as a catalyst." },
  { number: 45, symbol: "Rh", name: "Rhodium", mass: 102.91, category: "transition-metal", row: 5, col: 9, electronConfig: "[Kr] 4d⁸ 5s¹", electronegativity: 2.28, discovered: "1803", phase: "solid", density: 12.41, meltingPoint: 1964, boilingPoint: 3695, summary: "Brilliantly reflective and rare; the workhorse of catalytic converters." },
  { number: 46, symbol: "Pd", name: "Palladium", mass: 106.42, category: "transition-metal", row: 5, col: 10, electronConfig: "[Kr] 4d¹⁰", electronegativity: 2.20, discovered: "1803", phase: "solid", density: 12.02, meltingPoint: 1554.9, boilingPoint: 2963, summary: "Absorbs hydrogen like a sponge; central to catalysis and modern jewelry." },
  { number: 47, symbol: "Ag", name: "Silver", mass: 107.87, category: "transition-metal", row: 5, col: 11, electronConfig: "[Kr] 4d¹⁰ 5s¹", electronegativity: 1.93, discovered: "ancient", phase: "solid", density: 10.501, meltingPoint: 961.78, boilingPoint: 2162, summary: "The best electrical and thermal conductor of all elements; antimicrobial and lustrous." },
  { number: 48, symbol: "Cd", name: "Cadmium", mass: 112.41, category: "transition-metal", row: 5, col: 12, electronConfig: "[Kr] 4d¹⁰ 5s²", electronegativity: 1.69, discovered: "1817", phase: "solid", density: 8.69, meltingPoint: 321.07, boilingPoint: 767, summary: "Soft, toxic, and once common in pigments and rechargeable batteries." },
  { number: 49, symbol: "In", name: "Indium", mass: 114.82, category: "post-transition", row: 5, col: 13, electronConfig: "[Kr] 4d¹⁰ 5s² 5p¹", electronegativity: 1.78, discovered: "1863", phase: "solid", density: 7.31, meltingPoint: 156.6, boilingPoint: 2072, summary: "Soft enough to scratch with a fingernail; essential to touchscreens and LCDs." },
  { number: 50, symbol: "Sn", name: "Tin", mass: 118.71, category: "post-transition", row: 5, col: 14, electronConfig: "[Kr] 4d¹⁰ 5s² 5p²", electronegativity: 1.96, discovered: "ancient", phase: "solid", density: 7.287, meltingPoint: 231.93, boilingPoint: 2602, summary: "Alloyed with copper to make bronze, defining an entire age of human history." },
  { number: 51, symbol: "Sb", name: "Antimony", mass: 121.76, category: "metalloid", row: 5, col: 15, electronConfig: "[Kr] 4d¹⁰ 5s² 5p³", electronegativity: 2.05, discovered: "ancient", phase: "solid", density: 6.685, meltingPoint: 630.63, boilingPoint: 1587, summary: "Used in flame retardants and ancient cosmetics like kohl." },
  { number: 52, symbol: "Te", name: "Tellurium", mass: 127.60, category: "metalloid", row: 5, col: 16, electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁴", electronegativity: 2.1, discovered: "1782", phase: "solid", density: 6.232, meltingPoint: 449.51, boilingPoint: 988, summary: "A rare metalloid used in solar panels and rewritable optical discs." },
  { number: 53, symbol: "I", name: "Iodine", mass: 126.90, category: "halogen", row: 5, col: 17, electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁵", electronegativity: 2.66, discovered: "1811", phase: "solid", density: 4.93, meltingPoint: 113.7, boilingPoint: 184.3, summary: "Sublimes into purple vapor; essential for thyroid function." },
  { number: 54, symbol: "Xe", name: "Xenon", mass: 131.29, category: "noble-gas", row: 5, col: 18, electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁶", electronegativity: 2.6, discovered: "1898", phase: "gas", density: 0.005887, meltingPoint: -111.75, boilingPoint: -108.09, summary: "Heavy noble gas used in high-intensity lamps and ion thrusters for spacecraft." },
  { number: 55, symbol: "Cs", name: "Cesium", mass: 132.91, category: "alkali-metal", row: 6, col: 1, electronConfig: "[Xe] 6s¹", electronegativity: 0.79, discovered: "1860", phase: "solid", density: 1.873, meltingPoint: 28.44, boilingPoint: 671, summary: "Defines the SI second through its atomic transitions; melts just above room temperature." },
  { number: 56, symbol: "Ba", name: "Barium", mass: 137.33, category: "alkaline-earth", row: 6, col: 2, electronConfig: "[Xe] 6s²", electronegativity: 0.89, discovered: "1808", phase: "solid", density: 3.594, meltingPoint: 727, boilingPoint: 1845, summary: "Gives green color to fireworks; barium sulfate is swallowed for X-ray contrast." },
  { number: 57, symbol: "La", name: "Lanthanum", mass: 138.91, category: "lanthanide", row: 9, col: 4, electronConfig: "[Xe] 5d¹ 6s²", electronegativity: 1.10, discovered: "1839", phase: "solid", density: 6.145, meltingPoint: 920, boilingPoint: 3464, summary: "Namesake of the lanthanides; used in camera lenses and hybrid car batteries." },
  { number: 58, symbol: "Ce", name: "Cerium", mass: 140.12, category: "lanthanide", row: 9, col: 5, electronConfig: "[Xe] 4f¹ 5d¹ 6s²", electronegativity: 1.12, discovered: "1803", phase: "solid", density: 6.770, meltingPoint: 795, boilingPoint: 3443, summary: "The most abundant rare-earth; sparks in flint lighters and polishes glass." },
  { number: 59, symbol: "Pr", name: "Praseodymium", mass: 140.91, category: "lanthanide", row: 9, col: 6, electronConfig: "[Xe] 4f³ 6s²", electronegativity: 1.13, discovered: "1885", phase: "solid", density: 6.773, meltingPoint: 935, boilingPoint: 3520, summary: "Tints glass a striking yellow-green; alloys for aircraft engines." },
  { number: 60, symbol: "Nd", name: "Neodymium", mass: 144.24, category: "lanthanide", row: 9, col: 7, electronConfig: "[Xe] 4f⁴ 6s²", electronegativity: 1.14, discovered: "1885", phase: "solid", density: 7.007, meltingPoint: 1024, boilingPoint: 3074, summary: "Powers the strongest permanent magnets, found in headphones, motors, and hard drives." },
  { number: 61, symbol: "Pm", name: "Promethium", mass: 145, category: "lanthanide", row: 9, col: 8, electronConfig: "[Xe] 4f⁵ 6s²", electronegativity: 1.13, discovered: "1945", phase: "solid", density: 7.26, meltingPoint: 1042, boilingPoint: 3000, summary: "Radioactive and rare on Earth; once powered glow-in-the-dark watch dials." },
  { number: 62, symbol: "Sm", name: "Samarium", mass: 150.36, category: "lanthanide", row: 9, col: 9, electronConfig: "[Xe] 4f⁶ 6s²", electronegativity: 1.17, discovered: "1879", phase: "solid", density: 7.52, meltingPoint: 1072, boilingPoint: 1794, summary: "Forms heat-stable magnets used in aerospace and high-performance motors." },
  { number: 63, symbol: "Eu", name: "Europium", mass: 151.96, category: "lanthanide", row: 9, col: 10, electronConfig: "[Xe] 4f⁷ 6s²", electronegativity: 1.2, discovered: "1901", phase: "solid", density: 5.243, meltingPoint: 826, boilingPoint: 1529, summary: "Phosphors for red color in older TV screens and anti-counterfeiting marks on euro notes." },
  { number: 64, symbol: "Gd", name: "Gadolinium", mass: 157.25, category: "lanthanide", row: 9, col: 11, electronConfig: "[Xe] 4f⁷ 5d¹ 6s²", electronegativity: 1.20, discovered: "1880", phase: "solid", density: 7.895, meltingPoint: 1312, boilingPoint: 3273, summary: "Strongly paramagnetic; injected as a contrast agent for MRI scans." },
  { number: 65, symbol: "Tb", name: "Terbium", mass: 158.93, category: "lanthanide", row: 9, col: 12, electronConfig: "[Xe] 4f⁹ 6s²", electronegativity: 1.2, discovered: "1843", phase: "solid", density: 8.229, meltingPoint: 1356, boilingPoint: 3230, summary: "Glows green in fluorescent lamps and color displays." },
  { number: 66, symbol: "Dy", name: "Dysprosium", mass: 162.50, category: "lanthanide", row: 9, col: 13, electronConfig: "[Xe] 4f¹⁰ 6s²", electronegativity: 1.22, discovered: "1886", phase: "solid", density: 8.55, meltingPoint: 1407, boilingPoint: 2562, summary: "Crucial in high-temperature magnets for wind turbines and electric vehicles." },
  { number: 67, symbol: "Ho", name: "Holmium", mass: 164.93, category: "lanthanide", row: 9, col: 14, electronConfig: "[Xe] 4f¹¹ 6s²", electronegativity: 1.23, discovered: "1878", phase: "solid", density: 8.795, meltingPoint: 1461, boilingPoint: 2720, summary: "Has the highest magnetic strength of any naturally occurring element." },
  { number: 68, symbol: "Er", name: "Erbium", mass: 167.26, category: "lanthanide", row: 9, col: 15, electronConfig: "[Xe] 4f¹² 6s²", electronegativity: 1.24, discovered: "1842", phase: "solid", density: 9.066, meltingPoint: 1529, boilingPoint: 2868, summary: "Amplifies light in fiber-optic cables that power the global internet." },
  { number: 69, symbol: "Tm", name: "Thulium", mass: 168.93, category: "lanthanide", row: 9, col: 16, electronConfig: "[Xe] 4f¹³ 6s²", electronegativity: 1.25, discovered: "1879", phase: "solid", density: 9.321, meltingPoint: 1545, boilingPoint: 1950, summary: "The least abundant naturally occurring lanthanide; used in portable X-ray devices." },
  { number: 70, symbol: "Yb", name: "Ytterbium", mass: 173.05, category: "lanthanide", row: 9, col: 17, electronConfig: "[Xe] 4f¹⁴ 6s²", electronegativity: 1.1, discovered: "1878", phase: "solid", density: 6.965, meltingPoint: 824, boilingPoint: 1196, summary: "Powers the most precise atomic clocks ever built." },
  { number: 71, symbol: "Lu", name: "Lutetium", mass: 174.97, category: "lanthanide", row: 9, col: 18, electronConfig: "[Xe] 4f¹⁴ 5d¹ 6s²", electronegativity: 1.27, discovered: "1907", phase: "solid", density: 9.84, meltingPoint: 1652, boilingPoint: 3402, summary: "The hardest and densest lanthanide; used in PET scan detectors." },
  { number: 72, symbol: "Hf", name: "Hafnium", mass: 178.49, category: "transition-metal", row: 6, col: 4, electronConfig: "[Xe] 4f¹⁴ 5d² 6s²", electronegativity: 1.3, discovered: "1923", phase: "solid", density: 13.31, meltingPoint: 2233, boilingPoint: 4603, summary: "Absorbs neutrons hungrily; used in nuclear reactor control rods." },
  { number: 73, symbol: "Ta", name: "Tantalum", mass: 180.95, category: "transition-metal", row: 6, col: 5, electronConfig: "[Xe] 4f¹⁴ 5d³ 6s²", electronegativity: 1.5, discovered: "1802", phase: "solid", density: 16.654, meltingPoint: 3017, boilingPoint: 5458, summary: "Highly corrosion-resistant; the foundation of capacitors in modern electronics." },
  { number: 74, symbol: "W", name: "Tungsten", mass: 183.84, category: "transition-metal", row: 6, col: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁴ 6s²", electronegativity: 2.36, discovered: "1783", phase: "solid", density: 19.25, meltingPoint: 3422, boilingPoint: 5555, summary: "Has the highest melting point of any metal; classic light-bulb filament material." },
  { number: 75, symbol: "Re", name: "Rhenium", mass: 186.21, category: "transition-metal", row: 6, col: 7, electronConfig: "[Xe] 4f¹⁴ 5d⁵ 6s²", electronegativity: 1.9, discovered: "1925", phase: "solid", density: 21.02, meltingPoint: 3186, boilingPoint: 5596, summary: "One of the rarest stable elements; alloyed in jet engine turbine blades." },
  { number: 76, symbol: "Os", name: "Osmium", mass: 190.23, category: "transition-metal", row: 6, col: 8, electronConfig: "[Xe] 4f¹⁴ 5d⁶ 6s²", electronegativity: 2.2, discovered: "1803", phase: "solid", density: 22.59, meltingPoint: 3033, boilingPoint: 5012, summary: "The densest naturally occurring element; tipped fountain pen nibs and phonograph needles." },
  { number: 77, symbol: "Ir", name: "Iridium", mass: 192.22, category: "transition-metal", row: 6, col: 9, electronConfig: "[Xe] 4f¹⁴ 5d⁷ 6s²", electronegativity: 2.20, discovered: "1803", phase: "solid", density: 22.56, meltingPoint: 2466, boilingPoint: 4428, summary: "Extraordinarily corrosion-resistant; the iridium spike marks the dinosaur extinction layer." },
  { number: 78, symbol: "Pt", name: "Platinum", mass: 195.08, category: "transition-metal", row: 6, col: 10, electronConfig: "[Xe] 4f¹⁴ 5d⁹ 6s¹", electronegativity: 2.28, discovered: "1735", phase: "solid", density: 21.46, meltingPoint: 1768.3, boilingPoint: 3825, summary: "Inert, lustrous, and rare; central to catalytic converters and fine jewelry." },
  { number: 79, symbol: "Au", name: "Gold", mass: 196.97, category: "transition-metal", row: 6, col: 11, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", electronegativity: 2.54, discovered: "ancient", phase: "solid", density: 19.282, meltingPoint: 1064.18, boilingPoint: 2856, summary: "Untarnishable, malleable, and treasured throughout human history." },
  { number: 80, symbol: "Hg", name: "Mercury", mass: 200.59, category: "transition-metal", row: 6, col: 12, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", electronegativity: 2.00, discovered: "ancient", phase: "liquid", density: 13.5336, meltingPoint: -38.83, boilingPoint: 356.73, summary: "The only metal liquid at room temperature; once the heart of thermometers and barometers." },
  { number: 81, symbol: "Tl", name: "Thallium", mass: 204.38, category: "post-transition", row: 6, col: 13, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", electronegativity: 1.62, discovered: "1861", phase: "solid", density: 11.85, meltingPoint: 304, boilingPoint: 1473, summary: "Highly toxic; nicknamed 'the poisoner's poison' for its tasteless, odorless lethality." },
  { number: 82, symbol: "Pb", name: "Lead", mass: 207.2, category: "post-transition", row: 6, col: 14, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", electronegativity: 1.87, discovered: "ancient", phase: "solid", density: 11.342, meltingPoint: 327.46, boilingPoint: 1749, summary: "Dense, soft, and toxic; once ubiquitous in pipes, paint, and gasoline." },
  { number: 83, symbol: "Bi", name: "Bismuth", mass: 208.98, category: "post-transition", row: 6, col: 15, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", electronegativity: 2.02, discovered: "1753", phase: "solid", density: 9.807, meltingPoint: 271.4, boilingPoint: 1564, summary: "Forms iridescent rainbow crystals; soothes upset stomachs in Pepto-Bismol." },
  { number: 84, symbol: "Po", name: "Polonium", mass: 209, category: "post-transition", row: 6, col: 16, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", electronegativity: 2.0, discovered: "1898", phase: "solid", density: 9.32, meltingPoint: 254, boilingPoint: 962, summary: "Discovered by Marie Curie and named for Poland; intensely radioactive." },
  { number: 85, symbol: "At", name: "Astatine", mass: 210, category: "halogen", row: 6, col: 17, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", electronegativity: 2.2, discovered: "1940", phase: "solid", density: 7, meltingPoint: 302, boilingPoint: 337, summary: "The rarest naturally occurring element; less than a teaspoon exists in Earth's crust." },
  { number: 86, symbol: "Rn", name: "Radon", mass: 222, category: "noble-gas", row: 6, col: 18, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", electronegativity: 2.2, discovered: "1900", phase: "gas", density: 0.00973, meltingPoint: -71, boilingPoint: -61.7, summary: "A radioactive noble gas seeping from soil; second leading cause of lung cancer." },
  { number: 87, symbol: "Fr", name: "Francium", mass: 223, category: "alkali-metal", row: 7, col: 1, electronConfig: "[Rn] 7s¹", electronegativity: 0.7, discovered: "1939", phase: "solid", density: 1.87, meltingPoint: 27, boilingPoint: 677, summary: "The second-rarest element on Earth; so unstable that no one has seen a visible sample." },
  { number: 88, symbol: "Ra", name: "Radium", mass: 226, category: "alkaline-earth", row: 7, col: 2, electronConfig: "[Rn] 7s²", electronegativity: 0.9, discovered: "1898", phase: "solid", density: 5.5, meltingPoint: 700, boilingPoint: 1737, summary: "Discovered by the Curies; once used in glow-in-the-dark paint with tragic health consequences." },
  { number: 89, symbol: "Ac", name: "Actinium", mass: 227, category: "actinide", row: 10, col: 4, electronConfig: "[Rn] 6d¹ 7s²", electronegativity: 1.1, discovered: "1899", phase: "solid", density: 10.07, meltingPoint: 1051, boilingPoint: 3198, summary: "Glows pale blue from its own radiation; namesake of the actinide series." },
  { number: 90, symbol: "Th", name: "Thorium", mass: 232.04, category: "actinide", row: 10, col: 5, electronConfig: "[Rn] 6d² 7s²", electronegativity: 1.3, discovered: "1828", phase: "solid", density: 11.72, meltingPoint: 1750, boilingPoint: 4788, summary: "A potential nuclear fuel; more abundant than uranium and named for the Norse god Thor." },
  { number: 91, symbol: "Pa", name: "Protactinium", mass: 231.04, category: "actinide", row: 10, col: 6, electronConfig: "[Rn] 5f² 6d¹ 7s²", electronegativity: 1.5, discovered: "1913", phase: "solid", density: 15.37, meltingPoint: 1572, boilingPoint: 4000, summary: "Rare, dense, and highly radioactive; little practical use beyond research." },
  { number: 92, symbol: "U", name: "Uranium", mass: 238.03, category: "actinide", row: 10, col: 7, electronConfig: "[Rn] 5f³ 6d¹ 7s²", electronegativity: 1.38, discovered: "1789", phase: "solid", density: 19.1, meltingPoint: 1135, boilingPoint: 4131, summary: "Powers nuclear reactors and weapons; the heaviest element found in significant quantity in nature." },
  { number: 93, symbol: "Np", name: "Neptunium", mass: 237, category: "actinide", row: 10, col: 8, electronConfig: "[Rn] 5f⁴ 6d¹ 7s²", electronegativity: 1.36, discovered: "1940", phase: "solid", density: 20.45, meltingPoint: 644, boilingPoint: 4000, summary: "First synthetic transuranium element; named for the planet Neptune." },
  { number: 94, symbol: "Pu", name: "Plutonium", mass: 244, category: "actinide", row: 10, col: 9, electronConfig: "[Rn] 5f⁶ 7s²", electronegativity: 1.28, discovered: "1940", phase: "solid", density: 19.84, meltingPoint: 640, boilingPoint: 3228, summary: "Used in nuclear weapons and powers Voyager and Curiosity rover." },
  { number: 95, symbol: "Am", name: "Americium", mass: 243, category: "actinide", row: 10, col: 10, electronConfig: "[Rn] 5f⁷ 7s²", electronegativity: 1.13, discovered: "1944", phase: "solid", density: 13.69, meltingPoint: 1176, boilingPoint: 2011, summary: "Inside common smoke detectors as a tiny ionizing source." },
  { number: 96, symbol: "Cm", name: "Curium", mass: 247, category: "actinide", row: 10, col: 11, electronConfig: "[Rn] 5f⁷ 6d¹ 7s²", electronegativity: 1.28, discovered: "1944", phase: "solid", density: 13.51, meltingPoint: 1345, boilingPoint: 3110, summary: "Named after Marie and Pierre Curie; powers space probes and X-ray spectrometers." },
  { number: 97, symbol: "Bk", name: "Berkelium", mass: 247, category: "actinide", row: 10, col: 12, electronConfig: "[Rn] 5f⁹ 7s²", electronegativity: 1.3, discovered: "1949", phase: "solid", density: 14.79, meltingPoint: 986, boilingPoint: null, summary: "Synthesized in microgram quantities; used to discover heavier superheavy elements." },
  { number: 98, symbol: "Cf", name: "Californium", mass: 251, category: "actinide", row: 10, col: 13, electronConfig: "[Rn] 5f¹⁰ 7s²", electronegativity: 1.3, discovered: "1950", phase: "solid", density: 15.1, meltingPoint: 900, boilingPoint: null, summary: "A potent neutron emitter used to start nuclear reactors and probe oil wells." },
  { number: 99, symbol: "Es", name: "Einsteinium", mass: 252, category: "actinide", row: 10, col: 14, electronConfig: "[Rn] 5f¹¹ 7s²", electronegativity: 1.3, discovered: "1952", phase: "solid", density: 8.84, meltingPoint: 860, boilingPoint: null, summary: "Discovered in fallout from the first hydrogen bomb test; named for Einstein." },
  { number: 100, symbol: "Fm", name: "Fermium", mass: 257, category: "actinide", row: 10, col: 15, electronConfig: "[Rn] 5f¹² 7s²", electronegativity: 1.3, discovered: "1952", phase: "solid", density: null, meltingPoint: 1527, boilingPoint: null, summary: "Heaviest element produced by neutron bombardment; named for Enrico Fermi." },
  { number: 101, symbol: "Md", name: "Mendelevium", mass: 258, category: "actinide", row: 10, col: 16, electronConfig: "[Rn] 5f¹³ 7s²", electronegativity: 1.3, discovered: "1955", phase: "solid", density: null, meltingPoint: 827, boilingPoint: null, summary: "Named after Dmitri Mendeleev, creator of the periodic table itself." },
  { number: 102, symbol: "No", name: "Nobelium", mass: 259, category: "actinide", row: 10, col: 17, electronConfig: "[Rn] 5f¹⁴ 7s²", electronegativity: 1.3, discovered: "1958", phase: "solid", density: null, meltingPoint: 827, boilingPoint: null, summary: "Named for Alfred Nobel; only a few atoms have ever been observed at a time." },
  { number: 103, symbol: "Lr", name: "Lawrencium", mass: 266, category: "actinide", row: 10, col: 18, electronConfig: "[Rn] 5f¹⁴ 7s² 7p¹", electronegativity: 1.3, discovered: "1961", phase: "solid", density: null, meltingPoint: 1627, boilingPoint: null, summary: "Final actinide; named for cyclotron inventor Ernest Lawrence." },
  { number: 104, symbol: "Rf", name: "Rutherfordium", mass: 267, category: "transition-metal", row: 7, col: 4, electronConfig: "[Rn] 5f¹⁴ 6d² 7s²", electronegativity: null, discovered: "1964", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "First transactinide element; named for Ernest Rutherford." },
  { number: 105, symbol: "Db", name: "Dubnium", mass: 268, category: "transition-metal", row: 7, col: 5, electronConfig: "[Rn] 5f¹⁴ 6d³ 7s²", electronegativity: null, discovered: "1968", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named after Dubna, Russia, where it was synthesized." },
  { number: 106, symbol: "Sg", name: "Seaborgium", mass: 269, category: "transition-metal", row: 7, col: 6, electronConfig: "[Rn] 5f¹⁴ 6d⁴ 7s²", electronegativity: null, discovered: "1974", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named for Glenn Seaborg, the only person honored on the table during his lifetime." },
  { number: 107, symbol: "Bh", name: "Bohrium", mass: 270, category: "transition-metal", row: 7, col: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁵ 7s²", electronegativity: null, discovered: "1981", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named for Niels Bohr, founder of quantum atomic theory." },
  { number: 108, symbol: "Hs", name: "Hassium", mass: 269, category: "transition-metal", row: 7, col: 8, electronConfig: "[Rn] 5f¹⁴ 6d⁶ 7s²", electronegativity: null, discovered: "1984", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named for the German state of Hesse, home to its discoverers." },
  { number: 109, symbol: "Mt", name: "Meitnerium", mass: 278, category: "transition-metal", row: 7, col: 9, electronConfig: "[Rn] 5f¹⁴ 6d⁷ 7s²", electronegativity: null, discovered: "1982", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named for Lise Meitner, who co-discovered nuclear fission." },
  { number: 110, symbol: "Ds", name: "Darmstadtium", mass: 281, category: "transition-metal", row: 7, col: 10, electronConfig: "[Rn] 5f¹⁴ 6d⁸ 7s²", electronegativity: null, discovered: "1994", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named after Darmstadt, Germany, where many superheavy elements were created." },
  { number: 111, symbol: "Rg", name: "Roentgenium", mass: 282, category: "transition-metal", row: 7, col: 11, electronConfig: "[Rn] 5f¹⁴ 6d⁹ 7s²", electronegativity: null, discovered: "1994", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named for Wilhelm Röntgen, discoverer of X-rays." },
  { number: 112, symbol: "Cn", name: "Copernicium", mass: 285, category: "transition-metal", row: 7, col: 12, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s²", electronegativity: null, discovered: "1996", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named for Copernicus; predicted to be a liquid at room temperature." },
  { number: 113, symbol: "Nh", name: "Nihonium", mass: 286, category: "post-transition", row: 7, col: 13, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹", electronegativity: null, discovered: "2003", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named after Japan ('Nihon'); the first element discovered in Asia." },
  { number: 114, symbol: "Fl", name: "Flerovium", mass: 289, category: "post-transition", row: 7, col: 14, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²", electronegativity: null, discovered: "1998", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named for the Flerov Laboratory; sits in the predicted 'island of stability'." },
  { number: 115, symbol: "Mc", name: "Moscovium", mass: 289, category: "post-transition", row: 7, col: 15, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³", electronegativity: null, discovered: "2003", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named after the Moscow region; only a handful of atoms ever produced." },
  { number: 116, symbol: "Lv", name: "Livermorium", mass: 293, category: "post-transition", row: 7, col: 16, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴", electronegativity: null, discovered: "2000", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named after Lawrence Livermore National Laboratory in California." },
  { number: 117, symbol: "Ts", name: "Tennessine", mass: 294, category: "halogen", row: 7, col: 17, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵", electronegativity: null, discovered: "2010", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "Named for Tennessee, home to Oak Ridge National Laboratory." },
  { number: 118, symbol: "Og", name: "Oganesson", mass: 294, category: "noble-gas", row: 7, col: 18, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶", electronegativity: null, discovered: "2002", phase: "solid", density: null, meltingPoint: null, boilingPoint: null, summary: "The heaviest element confirmed; named after living scientist Yuri Oganessian." },
];

// Category metadata — colors, labels, descriptions
const CATEGORIES = {
  "alkali-metal":     { label: "Alkali metal",         color: "#d97757", soft: "#f5d4c5" },
  "alkaline-earth":   { label: "Alkaline earth metal", color: "#e8a87c", soft: "#f8e0cf" },
  "transition-metal": { label: "Transition metal",     color: "#c08552", soft: "#ecd6c0" },
  "post-transition":  { label: "Post-transition metal",color: "#a3a380", soft: "#dcdcc6" },
  "metalloid":        { label: "Metalloid",            color: "#7a9e7e", soft: "#cfdcd0" },
  "nonmetal":         { label: "Reactive nonmetal",    color: "#5b8aa6", soft: "#c6d6e0" },
  "halogen":          { label: "Halogen",              color: "#3f7d8c", soft: "#bcd0d4" },
  "noble-gas":        { label: "Noble gas",            color: "#7e6b8f", soft: "#d4cce0" },
  "lanthanide":       { label: "Lanthanide",           color: "#b8657d", soft: "#ebcfd8" },
  "actinide":         { label: "Actinide",             color: "#8e5572", soft: "#dec7d3" },
};

// Property modes for color-by switcher
const PROPERTY_MODES = [
  { id: "category", label: "Category" },
  { id: "phase", label: "Phase at 25°C" },
  { id: "electronegativity", label: "Electronegativity" },
  { id: "mass", label: "Atomic mass" },
];

const PHASE_COLORS = {
  solid:  "#8a7e6a",
  liquid: "#4a90a4",
  gas:    "#d99a55",
};

// Helper: compute color for an element under a given mode
function colorFor(el, mode) {
  if (mode === "category") return CATEGORIES[el.category].color;
  if (mode === "phase") return PHASE_COLORS[el.phase] || "#999";
  if (mode === "electronegativity") {
    if (el.electronegativity == null) return "#cfc8bc";
    // Map 0.7 → 4.0 onto a warm-to-cool gradient
    const t = Math.min(1, Math.max(0, (el.electronegativity - 0.7) / (4.0 - 0.7)));
    return interpolateColor("#e8c4a0", "#2a4d6e", t);
  }
  if (mode === "mass") {
    const t = Math.min(1, Math.max(0, Math.log(el.mass) / Math.log(295)));
    return interpolateColor("#f0e3d0", "#5d3a4a", t);
  }
  return "#ccc";
}

function interpolateColor(a, b, t) {
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");
  const ar = parseInt(ah.substring(0, 2), 16);
  const ag = parseInt(ah.substring(2, 4), 16);
  const ab = parseInt(ah.substring(4, 6), 16);
  const br = parseInt(bh.substring(0, 2), 16);
  const bg = parseInt(bh.substring(2, 4), 16);
  const bb = parseInt(bh.substring(4, 6), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export default function PeriodicTable() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("category");

  const matches = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.trim().toLowerCase();
    const set = new Set();
    ELEMENTS.forEach((el) => {
      if (
        el.name.toLowerCase().includes(q) ||
        el.symbol.toLowerCase() === q ||
        el.symbol.toLowerCase().startsWith(q) ||
        String(el.number) === q ||
        el.category.includes(q)
      ) set.add(el.number);
    });
    return set;
  }, [search]);

  const display = hovered || selected;

  return (
    <div className="pt-root">
      <style>{css}</style>

      <header className="pt-header">
        <div className="pt-title-block">
          <div className="pt-eyebrow">Reference / Chemistry</div>
          <h1 className="pt-title">The Periodic Table</h1>
          <p className="pt-subtitle">
            118 elements, arranged by atomic number. Hover for a glance, click to pin.
          </p>
        </div>

        <div className="pt-controls">
          <div className="pt-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              placeholder="Search element, symbol, or number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="pt-clear" onClick={() => setSearch("")} aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          <div className="pt-mode">
            {PROPERTY_MODES.map((m) => (
              <button
                key={m.id}
                className={`pt-mode-btn ${mode === m.id ? "active" : ""}`}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="pt-grid-wrap">
        <div className="pt-grid">
          {ELEMENTS.map((el) => {
            const dim = matches && !matches.has(el.number);
            const isSelected = selected?.number === el.number;
            const isHovered = hovered?.number === el.number;
            const fill = colorFor(el, mode);
            return (
              <button
                key={el.number}
                className={`pt-cell ${dim ? "dim" : ""} ${isSelected ? "selected" : ""} ${isHovered ? "hovered" : ""}`}
                style={{
                  gridRow: el.row,
                  gridColumn: el.col,
                  "--cell-color": fill,
                }}
                onMouseEnter={() => setHovered(el)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(isSelected ? null : el)}
                aria-label={`${el.name}, atomic number ${el.number}`}
              >
                <span className="pt-cell-number">{el.number}</span>
                <span className="pt-cell-symbol">{el.symbol}</span>
                <span className="pt-cell-name">{el.name}</span>
                <span className="pt-cell-mass">{Number.isInteger(el.mass) ? `(${el.mass})` : el.mass.toFixed(2)}</span>
              </button>
            );
          })}

          {/* Lanthanide / actinide indicator placeholders in main grid */}
          <div className="pt-cell pt-placeholder" style={{ gridRow: 6, gridColumn: 3 }}>
            <span className="pt-placeholder-text">57–71</span>
          </div>
          <div className="pt-cell pt-placeholder" style={{ gridRow: 7, gridColumn: 3 }}>
            <span className="pt-placeholder-text">89–103</span>
          </div>

          {/* Lanthanide/actinide row labels */}
          <div className="pt-row-label" style={{ gridRow: 9, gridColumn: 3 }}>Lanthanides</div>
          <div className="pt-row-label" style={{ gridRow: 10, gridColumn: 3 }}>Actinides</div>
        </div>
      </div>

      {/* Detail panel */}
      <div className={`pt-detail ${display ? "show" : ""}`}>
        {display ? (
          <DetailContent el={display} pinned={!!selected && selected.number === display.number} />
        ) : (
          <div className="pt-detail-empty">
            <div className="pt-detail-empty-num">—</div>
            <div className="pt-detail-empty-text">
              Hover any element for details, or click to pin. Try searching <em>noble</em>, <em>Au</em>, or <em>26</em>.
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="pt-legend">
        {mode === "category" && Object.entries(CATEGORIES).map(([key, val]) => (
          <div key={key} className="pt-legend-item">
            <span className="pt-legend-swatch" style={{ background: val.color }} />
            <span>{val.label}</span>
          </div>
        ))}
        {mode === "phase" && (
          <>
            <div className="pt-legend-item"><span className="pt-legend-swatch" style={{ background: PHASE_COLORS.solid }} /><span>Solid</span></div>
            <div className="pt-legend-item"><span className="pt-legend-swatch" style={{ background: PHASE_COLORS.liquid }} /><span>Liquid</span></div>
            <div className="pt-legend-item"><span className="pt-legend-swatch" style={{ background: PHASE_COLORS.gas }} /><span>Gas</span></div>
          </>
        )}
        {mode === "electronegativity" && (
          <div className="pt-legend-gradient">
            <span className="pt-legend-grad-label">0.7</span>
            <span className="pt-legend-grad-bar" style={{ background: "linear-gradient(to right, #e8c4a0, #2a4d6e)" }} />
            <span className="pt-legend-grad-label">4.0</span>
            <span className="pt-legend-note">Pauling scale</span>
          </div>
        )}
        {mode === "mass" && (
          <div className="pt-legend-gradient">
            <span className="pt-legend-grad-label">1</span>
            <span className="pt-legend-grad-bar" style={{ background: "linear-gradient(to right, #f0e3d0, #5d3a4a)" }} />
            <span className="pt-legend-grad-label">295</span>
            <span className="pt-legend-note">u (logarithmic)</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailContent({ el, pinned }) {
  const cat = CATEGORIES[el.category];
  return (
    <div className="pt-detail-inner">
      <div className="pt-detail-left">
        <div className="pt-detail-num">{el.number}</div>
        <div className="pt-detail-symbol" style={{ color: cat.color }}>{el.symbol}</div>
        <div className="pt-detail-name">{el.name}</div>
        <div className="pt-detail-cat" style={{ background: cat.soft, color: cat.color }}>
          {cat.label}
        </div>
        {pinned && <div className="pt-detail-pin">● Pinned</div>}
      </div>

      <div className="pt-detail-mid">
        <p className="pt-detail-summary">{el.summary}</p>
        <div className="pt-detail-grid">
          <Stat label="Atomic mass" value={`${el.mass} u`} />
          <Stat label="Phase (25°C)" value={cap(el.phase)} />
          <Stat label="Density" value={el.density != null ? `${el.density} g/cm³` : "—"} />
          <Stat label="Melting" value={el.meltingPoint != null ? `${el.meltingPoint}°C` : "—"} />
          <Stat label="Boiling" value={el.boilingPoint != null ? `${el.boilingPoint}°C` : "—"} />
          <Stat label="Electronegativity" value={el.electronegativity != null ? el.electronegativity : "—"} />
          <Stat label="Electron config" value={el.electronConfig} mono />
          <Stat label="Discovered" value={cap(el.discovered)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, mono }) {
  return (
    <div className="pt-stat">
      <div className="pt-stat-label">{label}</div>
      <div className={`pt-stat-value ${mono ? "mono" : ""}`}>{value}</div>
    </div>
  );
}

function cap(s) {
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.pt-root {
  --bg: #f5f0e8;
  --bg-2: #ebe4d6;
  --ink: #2a2520;
  --ink-soft: #6b5e52;
  --line: #d8cdb8;
  --accent: #b85c3c;
  --paper: #faf6ef;

  background: var(--bg);
  background-image:
    radial-gradient(circle at 20% 10%, rgba(255, 240, 220, 0.5), transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(220, 200, 180, 0.4), transparent 40%);
  color: var(--ink);
  font-family: 'Inter', sans-serif;
  padding: 32px 24px 40px;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

/* Header */
.pt-header {
  max-width: 1400px;
  margin: 0 auto 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--line);
  padding-bottom: 24px;
}
.pt-eyebrow {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-bottom: 8px;
}
.pt-title {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0;
  font-style: italic;
}
.pt-subtitle {
  margin: 12px 0 0;
  font-size: 14px;
  color: var(--ink-soft);
  max-width: 480px;
}

.pt-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}
.pt-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 14px;
  width: 280px;
  transition: border-color 0.2s;
}
.pt-search:focus-within {
  border-color: var(--accent);
}
.pt-search svg {
  color: var(--ink-soft);
  flex-shrink: 0;
}
.pt-search input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-size: 13px;
  font-family: inherit;
  color: var(--ink);
}
.pt-search input::placeholder { color: var(--ink-soft); }
.pt-clear {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--ink-soft);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.pt-mode {
  display: flex;
  gap: 4px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 3px;
}
.pt-mode-btn {
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  color: var(--ink-soft);
  transition: all 0.2s;
  font-weight: 500;
}
.pt-mode-btn:hover { color: var(--ink); }
.pt-mode-btn.active {
  background: var(--ink);
  color: var(--paper);
}

/* Grid */
.pt-grid-wrap {
  max-width: 1400px;
  margin: 0 auto;
  overflow-x: auto;
  padding-bottom: 8px;
}
.pt-grid {
  display: grid;
  grid-template-columns: repeat(18, minmax(58px, 1fr));
  grid-template-rows: repeat(7, minmax(58px, auto)) 18px repeat(2, minmax(58px, auto));
  gap: 4px;
  min-width: 1100px;
}

.pt-cell {
  position: relative;
  background: var(--paper);
  border: 1px solid var(--line);
  border-left: 3px solid var(--cell-color);
  border-radius: 4px;
  padding: 4px 5px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1px;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
  overflow: hidden;
  aspect-ratio: 1;
  min-height: 0;
}
.pt-cell::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--cell-color);
  opacity: 0.08;
  pointer-events: none;
  transition: opacity 0.2s;
}
.pt-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 30, 20, 0.12);
  z-index: 5;
  border-color: var(--ink);
}
.pt-cell:hover::before { opacity: 0.18; }
.pt-cell.selected {
  border-color: var(--ink);
  box-shadow: 0 0 0 2px var(--ink), 0 6px 16px rgba(40, 30, 20, 0.15);
  z-index: 6;
}
.pt-cell.selected::before { opacity: 0.22; }
.pt-cell.dim { opacity: 0.18; }
.pt-cell.hovered { z-index: 5; }

.pt-cell-number {
  font-size: 9px;
  color: var(--ink-soft);
  font-weight: 500;
  position: relative;
  z-index: 1;
}
.pt-cell-symbol {
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
  margin-top: 1px;
  position: relative;
  z-index: 1;
  letter-spacing: -0.01em;
}
.pt-cell-name {
  font-size: 8.5px;
  color: var(--ink-soft);
  margin-top: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
  font-weight: 500;
}
.pt-cell-mass {
  font-family: 'JetBrains Mono', monospace;
  font-size: 7.5px;
  color: var(--ink-soft);
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;
}

.pt-placeholder {
  background: transparent;
  border: 1px dashed var(--line);
  border-left: 1px dashed var(--line);
  cursor: default;
  align-items: center;
  justify-content: center;
}
.pt-placeholder::before { display: none; }
.pt-placeholder:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--line);
}
.pt-placeholder-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--ink-soft);
  letter-spacing: -0.02em;
}

.pt-row-label {
  grid-column: 1 / 4 !important;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 13px;
  color: var(--ink-soft);
}

/* Detail */
.pt-detail {
  max-width: 1400px;
  margin: 24px auto 0;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  min-height: 180px;
  transition: opacity 0.2s;
  overflow: hidden;
}
.pt-detail-empty {
  padding: 40px 32px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.pt-detail-empty-num {
  font-family: 'Fraunces', serif;
  font-size: 48px;
  color: var(--line);
  line-height: 1;
  font-weight: 300;
}
.pt-detail-empty-text {
  color: var(--ink-soft);
  font-size: 14px;
  max-width: 500px;
}
.pt-detail-empty-text em {
  color: var(--ink);
  font-style: italic;
  font-family: 'Fraunces', serif;
}
.pt-detail-inner {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 0;
}
.pt-detail-left {
  padding: 24px 28px;
  background: var(--bg-2);
  border-right: 1px solid var(--line);
  position: relative;
}
.pt-detail-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--ink-soft);
  letter-spacing: 0.05em;
}
.pt-detail-symbol {
  font-family: 'Fraunces', serif;
  font-size: 80px;
  font-weight: 500;
  line-height: 1;
  margin-top: 4px;
  letter-spacing: -0.03em;
}
.pt-detail-name {
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-style: italic;
  margin-top: 4px;
  letter-spacing: -0.01em;
}
.pt-detail-cat {
  display: inline-block;
  margin-top: 14px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.pt-detail-pin {
  margin-top: 12px;
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
}
.pt-detail-mid {
  padding: 24px 28px;
}
.pt-detail-summary {
  font-family: 'Fraunces', serif;
  font-size: 17px;
  line-height: 1.5;
  margin: 0 0 20px;
  color: var(--ink);
  font-style: italic;
  letter-spacing: -0.005em;
}
.pt-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px 24px;
}
.pt-stat-label {
  font-size: 10px;
  color: var(--ink-soft);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 4px;
  font-weight: 500;
}
.pt-stat-value {
  font-size: 14px;
  color: var(--ink);
  font-weight: 500;
}
.pt-stat-value.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 400;
}

/* Legend */
.pt-legend {
  max-width: 1400px;
  margin: 20px auto 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  padding: 14px 18px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  align-items: center;
}
.pt-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--ink-soft);
}
.pt-legend-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  display: inline-block;
}
.pt-legend-gradient {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--ink-soft);
}
.pt-legend-grad-bar {
  width: 220px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
}
.pt-legend-grad-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}
.pt-legend-note {
  font-style: italic;
  font-family: 'Fraunces', serif;
  margin-left: 8px;
}

@media (max-width: 768px) {
  .pt-header { flex-direction: column; align-items: flex-start; }
  .pt-controls { width: 100%; align-items: stretch; }
  .pt-search { width: 100%; box-sizing: border-box; }
  .pt-detail-inner { grid-template-columns: 1fr; }
  .pt-detail-left { border-right: none; border-bottom: 1px solid var(--line); }
}
`;
