import { caption, section } from "../helpers.js";
import { initial } from "../state.js";

export function formsTab(s = initial()) {
  const options = [{ value: "es", label: "Español", labelEn: "Spanish" }, { value: "en", label: "Inglés", labelEn: "English" }, { value: "pt", label: "Portugués", labelEn: "Portuguese" }];
  return [
    section("form", "Formulario con validación", "Form with validation", "Form · form · submit: true", [
      {
        type: "Form", key: "signup", onSubmitted: "submit", gap: 12,
        children: [
          { type: "TextField", key: "name", labelText: "Nombre", labelTextEn: "Name", required: true, minLength: 2, maxLength: 40, errorText: "Escribe al menos 2 letras", errorTextEn: "Type at least 2 letters" },
          { type: "TextField", key: "email", kind: "email", labelText: "Correo", labelTextEn: "Email", hintText: "ana@ejemplo.com", hintTextEn: "ana@example.com", required: true, pattern: "^[^@\\s]+@[^@\\s]+\\.[A-Za-z]{2,}$", errorText: "Revisa el correo", errorTextEn: "Check the email" },
          { type: "TextField", key: "about", labelText: "Sobre ti", labelTextEn: "About you", multiline: true, maxLength: 300 },
          { type: "DropdownButton", key: "language", labelText: "Idioma", labelTextEn: "Language", options, required: true, errorText: "Elige un idioma", errorTextEn: "Pick a language" },
          { type: "RadioGroup", key: "plan", labelText: "Plan", labelTextEn: "Plan", value: "free", options: [{ value: "free", label: "Gratis", labelEn: "Free" }, { value: "family", label: "Familiar", labelEn: "Family" }] },
          { type: "Chips", key: "topics", labelText: "Temas (1 a 2)", labelTextEn: "Topics (1 to 2)", multiple: true, required: true, minLength: 1, maxLength: 2, options: [{ value: "drama", label: "Drama" }, { value: "comedy", label: "Comedia", labelEn: "Comedy" }, { value: "docs", label: "Documentales", labelEn: "Documentaries" }] },
          { type: "NumberStepper", key: "seats", labelText: "Asientos", labelTextEn: "Seats", value: 2, min: 1, max: 8, editable: true },
          { type: "NumberStepper", key: "price", labelText: "Precio", labelTextEn: "Price", value: 2.5, min: 0, max: 10, step: 0.25, decimals: 2 },
          { type: "Slider", key: "volume", labelText: "Volumen", labelTextEn: "Volume", min: 0, max: 10, step: 1, value: 5 },
          { type: "Switch", key: "news", labelText: "Recibir novedades", labelTextEn: "Get news" },
          { type: "Checkbox", key: "terms", labelText: "Acepto las condiciones", labelTextEn: "I accept the terms", required: true, errorText: "Hace falta aceptarlas", errorTextEn: "You need to accept them" },
          { type: "ElevatedButton", key: "submitSignup", labelText: "Enviar", labelTextEn: "Send", submit: true },
        ],
      },
    ]),
    section("validation", "Tu propio veredicto", "Your own verdict", "forceErrorText", [
      caption("Escribe 1234 y comprueba: otro código muestra tu error bajo el campo hasta que lo edites.", "Type 1234 and check: another code shows your error under the field until you edit it."),
      { type: "TextField", key: "codeDemo", kind: "number", labelText: "Código", labelTextEn: "Code", maxLength: 8,
        ...(s.codeError ? { forceErrorText: "Ese código no es válido", forceErrorTextEn: "That code is not valid" } : {}) },
      { type: "Button", key: "checkCode", variant: "secondary", labelText: "Comprobar", labelTextEn: "Check", onPressed: "checkCode" },
    ]),
    section("inputs", "Campos sueltos", "Inputs on their own", "TextField · Switch · Slider (onChanged, outside a form)", [
      { type: "TextField", key: "search", kind: "search", labelText: "Buscar", labelTextEn: "Search", hintText: "Escribe y pulsa Enter", hintTextEn: "Type and press Enter", onSubmitted: "searched",
        trailingIcon: "search", trailingLabel: "Buscar ahora", trailingLabelEn: "Search now", onTrailingTap: "searched" },
      { type: "Switch", key: "darkDemo", labelText: "Un interruptor", labelTextEn: "A switch", onChanged: "changed" },
      { type: "Slider", key: "level", labelText: "Nivel", labelTextEn: "Level", min: 0, max: 100, step: 10, value: 30, onChanged: "changed" },
    ]),
    section("settings", "Ajustes del plugin", "The plugin's settings", "settings · bind · config", [
      caption("El nodo settings dibuja el formulario de Ajustes de Kino:", "The settings node draws Kino's own settings form:"),
      { type: "settings", keys: ["density"] },
      caption("Con autoSave el interruptor se guarda solo, sin Guardar:", "With autoSave the switch saves by itself, no Save button:"),
      { type: "settings", keys: ["tips"], autoSave: true },
      caption("Campos con bind: guardan el ajuste solos.", "Fields with bind: they store the setting by themselves."),
      { type: "TextField", key: "boundGreeting", bind: "greeting", labelText: "Saludo (bind)", labelTextEn: "Greeting (bind)" },
      { type: "Switch", key: "boundTips", bind: "tips", labelText: "Mostrar consejos (bind)", labelTextEn: "Show tips (bind)" },
      { type: "Button", key: "writeConfig", variant: "secondary", labelText: "Escribir «Hola» con config", labelTextEn: "Write \"Hello\" with config", onPressed: "writeConfig" },
    ]),
  ];
}
