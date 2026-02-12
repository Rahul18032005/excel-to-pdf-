
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import pdfplumber
import pandas as pd
import os
import sys
from datetime import datetime

class PDFToExcelConverter:
    def __init__(self, root):
        self.root = root
        self.root.title("Excelconverter | High-Speed Auto-Engine")
        self.root.geometry("600x450") # Fixed typo here: 600.450 -> 600x450
        self.root.configure(bg="#0f172a")
        
        self.brand_orange = "#f97316"
        self.dark_bg = "#0f172a"
        self.card_bg = "#1e293b"
        self.text_dim = "#94a3b8"

        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TProgressbar", thickness=10, troughcolor=self.dark_bg, background=self.brand_orange, bordercolor=self.dark_bg)
        
        self.setup_ui()
        print("\n" + "="*40)
        print(" AUTO-ENGINE INITIALIZED: DIRECT MODE")
        print(" (Files save automatically to the source folder)")
        print("="*40)

    def setup_ui(self):
        header_frame = tk.Frame(self.root, bg=self.dark_bg, pady=20)
        header_frame.pack(fill="x")
        
        tk.Label(header_frame, text="EXCELCONVERTER", font=('Inter', 10, 'bold'), bg=self.dark_bg, fg=self.brand_orange).pack()
        tk.Label(header_frame, text="Direct Extraction Unit", font=('Inter', 22, 'bold'), bg=self.dark_bg, fg="white").pack()

        card = tk.Frame(self.root, bg=self.card_bg, padx=30, pady=30, highlightbackground="#334155", highlightthickness=1)
        card.pack(pady=10, padx=40, fill="both", expand=True)

        self.pdf_path = tk.StringVar(value="SELECT PDF FOR AUTOMATIC PROCESSING")
        path_label = tk.Label(card, textvariable=self.pdf_path, wraplength=450, bg=self.card_bg, fg=self.text_dim, font=('Inter', 9))
        path_label.pack(pady=(0, 20))
        
        self.btn_select = tk.Button(card, text="SELECT SOURCE PDF", command=self.select_file, 
                              bg=self.brand_orange, fg="white", font=('Inter', 11, 'bold'), 
                              relief="flat", padx=30, pady=12, cursor="hand2")
        self.btn_select.pack()

        progress_frame = tk.Frame(card, bg=self.card_bg)
        progress_frame.pack(fill="x", pady=25)
        
        self.status_label = tk.Label(progress_frame, text="System Idle", bg=self.card_bg, fg=self.brand_orange, font=('Inter', 8, 'bold'))
        self.status_label.pack(anchor="w")
        
        self.progress = ttk.Progressbar(progress_frame, orient="horizontal", mode="determinate", style="TProgressbar")
        self.progress.pack(fill="x", pady=5)

        self.btn_convert = tk.Button(self.root, text="START CONVERSION", command=self.convert, 
                                   bg="#334155", fg="white", font=('Inter', 12, 'bold'), 
                                   relief="flat", padx=60, pady=15, state="disabled", cursor="hand2")
        self.btn_convert.pack(pady=20)

    def select_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
        if file_path:
            self.pdf_path.set(file_path)
            self.btn_convert.config(state="normal", bg=self.brand_orange)
            self.status_label.config(text="READY: SAVING TO SOURCE DIRECTORY")
            print(f">>> TARGET LOCKED: {file_path}")

    def convert(self):
        pdf_file = self.pdf_path.get()
        if not os.path.exists(pdf_file):
            return

        # Automatically determine the save path without asking the user
        base_dir = os.path.dirname(pdf_file)
        filename = os.path.basename(pdf_file)
        name_no_ext = os.path.splitext(filename)[0]
        timestamp = datetime.now().strftime("%H%M%S")
        output_filename = f"{name_no_ext}_direct_{timestamp}.xlsx"
        save_path = os.path.join(base_dir, output_filename)

        print(f">>> STARTING DIRECT CONVERSION: {save_path}")
        
        try:
            self.btn_convert.config(state="disabled", text="PROCESSING...")
            
            with pdfplumber.open(pdf_file) as pdf:
                with pd.ExcelWriter(save_path, engine='openpyxl') as writer:
                    total_pages = len(pdf.pages)
                    
                    for i, page in enumerate(pdf.pages):
                        self.status_label.config(text=f"PROCESSING PAGE {i+1} OF {total_pages}")
                        tables = page.extract_tables()
                        if tables:
                            dfs = [pd.DataFrame(t[1:], columns=t[0]) for t in tables if t]
                            if dfs:
                                final_df = pd.concat(dfs, ignore_index=True)
                                final_df.to_excel(writer, sheet_name=f"Page_{i+1}", index=False)
                        
                        self.progress['value'] = ((i + 1) / total_pages) * 100
                        self.root.update_idletasks()

            print(f">>> CONVERSION SUCCESSFUL: {save_path}")
            self.status_label.config(text="DONE: FILE SAVED IN SOURCE FOLDER")
            # Minimalist success alert
            messagebox.showinfo("Success", f"Direct Conversion Complete!\nLocation: {save_path}")
            
        except Exception as e:
            print(f"!!! ENGINE ERROR: {str(e)}")
            messagebox.showerror("Engine Error", str(e))
        
        finally:
            self.btn_convert.config(state="normal", text="START CONVERSION")
            self.progress['value'] = 0

if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(line_buffering=True)
    root = tk.Tk()
    app = PDFToExcelConverter(root)
    root.mainloop()
