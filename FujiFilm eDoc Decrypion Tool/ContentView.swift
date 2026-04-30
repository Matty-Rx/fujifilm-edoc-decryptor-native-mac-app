//
//  ContentView.swift
//  FujiFilm eDoc Decrypion Tool
//
//  Created by Matt Rixon on 30/4/2026.
//

import AppKit
import Combine
import Foundation
import SwiftUI
import UniformTypeIdentifiers

struct ContentView: View {
    @StateObject private var model = ContentViewModel()
    @State private var showsAdvancedOptions = false
    @State private var isDropTargeted = false

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.96, green: 0.93, blue: 0.87),
                    Color(red: 0.87, green: 0.90, blue: 0.91),
                    Color(red: 0.80, green: 0.84, blue: 0.86)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 20) {
                header
                configurationCard
                activityCard
            }
            .padding(24)
            .frame(minWidth: 860, minHeight: 760)
        }
        .fileImporter(
            isPresented: $model.isPickingFolder,
            allowedContentTypes: [.folder],
            allowsMultipleSelection: false
        ) { result in
            model.handleFolderSelection(result)
        }
    }

    private var header: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Native macOS utility")
                    .font(.system(size: 12, weight: .bold, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.45))
                    .textCase(.uppercase)

                Text("FujiFilm EDOC Decryption Tool")
                .font(.system(size: 30, weight: .bold, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.82))

                Text("Choose a `manual/` folder, decrypt it, and open the result locally.")
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.62))
                    .lineLimit(2)
                    .frame(maxWidth: 680, alignment: .leading)
            }

            Spacer()

            statusBadge
        }
    }

    private var statusBadge: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(model.statusTitle)
                .font(.system(size: 12, weight: .bold, design: .rounded))
            Text(model.statusMessage)
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .lineLimit(2)
        }
        .foregroundStyle(Color.black.opacity(0.78))
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .frame(width: 210, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.white.opacity(0.62))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(Color.white.opacity(0.8), lineWidth: 1)
        )
    }

    private var configurationCard: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text("Quick Start")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(Color.black.opacity(0.8))

            Text("Most manuals only need one action: select the source folder and decrypt.")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundStyle(Color.black.opacity(0.58))

            workflowStrip

            PathRow(
                title: "Input Manual Folder",
                subtitle: "Choose the EDOC `manual/` directory to process.",
                value: model.inputDirectory?.path,
                placeholder: "No folder selected. Drag a `manual/` folder here.",
                accent: Color(red: 0.67, green: 0.30, blue: 0.20),
                browseTitle: "Choose Manual Folder",
                isDropTargeted: isDropTargeted
            ) {
                model.beginPicking(.input)
            }
            .dropDestination(for: URL.self) { items, _ in
                model.handleDroppedFolders(items)
            } isTargeted: { isTargeted in
                isDropTargeted = isTargeted
            }

            validationBanner

            VStack(alignment: .leading, spacing: 0) {
                Button {
                    withAnimation(.easeInOut(duration: 0.18)) {
                        showsAdvancedOptions.toggle()
                    }
                } label: {
                    HStack {
                        Label("Advanced Options", systemImage: "slider.horizontal.3")
                            .font(.system(size: 14, weight: .bold, design: .rounded))
                            .foregroundStyle(Color.black.opacity(0.74))

                        Spacer()

                        Image(systemName: showsAdvancedOptions ? "chevron.up" : "chevron.down")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(Color.black.opacity(0.48))
                    }
                    .padding(16)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)

                if showsAdvancedOptions {
                    VStack(alignment: .leading, spacing: 16) {
                        PathRow(
                            title: "Output Folder",
                            subtitle: model.isInPlace
                                ? "Disabled while in-place mode is enabled."
                            : "Required for sandboxed builds. Choose the destination folder where the decrypted manual should be written.",
                            value: model.outputDirectory?.path,
                            placeholder: "Choose output folder",
                            accent: Color(red: 0.26, green: 0.47, blue: 0.48),
                            browseTitle: "Choose Output Folder",
                            clearTitle: "Clear"
                        ) {
                            if !model.isInPlace {
                                model.beginPicking(.output)
                            }
                        } onClear: {
                            model.outputDirectory = nil
                        }
                        .opacity(model.isInPlace ? 0.55 : 1)

                        PathRow(
                            title: "common_e2 Override",
                            subtitle: "Optional. Use this only if you need to override the bundled/shared assets.",
                            value: model.commonE2Directory?.path,
                            placeholder: "Auto-detect or bundled copy",
                            accent: Color(red: 0.36, green: 0.35, blue: 0.15),
                            browseTitle: "Choose common_e2 Folder",
                            clearTitle: "Clear"
                        ) {
                            model.beginPicking(.commonE2)
                        } onClear: {
                            model.commonE2Directory = nil
                        }

                        Toggle(isOn: $model.isInPlace) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Modify the source folder in place")
                                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                                    .foregroundStyle(Color.black.opacity(0.78))
                                Text("Destructive. Use only if you do not want a separate decrypted copy.")
                                    .font(.system(size: 12, weight: .medium, design: .rounded))
                                    .foregroundStyle(Color.black.opacity(0.68))
                            }
                        }
                        .toggleStyle(.switch)
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                    .transition(.move(edge: .top).combined(with: .opacity))
                }
            }
            .background(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .fill(Color.white.opacity(0.52))
            )

            HStack(spacing: 12) {
                Button {
                    model.startProcessing()
                } label: {
                    Label(model.isProcessing ? "Processing…" : "Decrypt Manual", systemImage: "lock.open.trianglebadge.exclamationmark")
                        .font(.system(size: 15, weight: .bold, design: .rounded))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                }
                .buttonStyle(ActionButtonStyle(fill: Color(red: 0.70, green: 0.27, blue: 0.18)))
                .disabled(model.isProcessing)

                Button {
                    model.openPrimaryDocument()
                } label: {
                    Label("Open Manual", systemImage: "safari")
                        .font(.system(size: 15, weight: .bold, design: .rounded))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                }
                .buttonStyle(ActionButtonStyle(fill: Color(red: 0.20, green: 0.39, blue: 0.42)))
                .disabled(model.lastPrimaryDocument == nil)
            }

            if model.showsExpandedStatus {
                expandedStatusPanel
            }

            if model.lastOutputDirectory != nil || model.lastPrimaryDocument != nil {
                completionActions
            }
        }
        .padding(22)
        .background(cardBackground)
    }

    private var activityCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Activity")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.8))

                Spacer()

                if let summary = model.resultSummary {
                    Text(summary)
                        .font(.system(size: 12, weight: .bold, design: .rounded))
                        .foregroundStyle(Color.black.opacity(0.68))
                }
            }

            VStack(alignment: .leading, spacing: 8) {
                ProgressView(value: model.progress)
                    .progressViewStyle(.linear)
                    .tint(Color(red: 0.70, green: 0.27, blue: 0.18))

                Text(model.progressLabel)
                    .font(.system(size: 12, weight: .semibold, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.58))
            }

            ScrollView {
                LazyVStack(alignment: .leading, spacing: 8) {
                    ForEach(Array(model.logLines.enumerated()), id: \.offset) { _, line in
                        Text(line)
                            .font(.system(size: 12, weight: .medium, design: .monospaced))
                            .foregroundStyle(Color.black.opacity(0.73))
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .textSelection(.enabled)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .fill(Color.white.opacity(0.72))
            )
        }
        .padding(22)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(cardBackground)
    }

    private var workflowStrip: some View {
        HStack(spacing: 12) {
            WorkflowPill(number: "1", title: "Choose", detail: "Select the EDOC manual folder")
            WorkflowPill(number: "2", title: "Decrypt", detail: "Convert `.dat` pages to standard HTML")
            WorkflowPill(number: "3", title: "Open", detail: "Launch the generated manual locally")
        }
    }

    private var validationBanner: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: model.inputDirectory == nil ? "arrow.up.left.and.arrow.down.right.circle" : "checkmark.seal")
                .foregroundStyle(model.inputDirectory == nil ? Color(red: 0.64, green: 0.45, blue: 0.15) : Color(red: 0.18, green: 0.48, blue: 0.33))
                .padding(.top, 1)

            VStack(alignment: .leading, spacing: 4) {
                Text(model.inputDirectory == nil ? "Waiting for a manual folder" : "Ready to decrypt")
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.74))

                Text(model.inputDirectory == nil
                    ? "Pick the `manual/` directory first. Advanced options are only needed for unusual manual layouts."
                    : "For sandboxed macOS builds, choose an output folder before decrypting unless you use in-place mode. The decrypted manual and bundled `common_e2` assets are written directly into that location.")
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.56))
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.white.opacity(0.58))
        )
    }

    private var completionActions: some View {
        HStack(spacing: 10) {
            if model.lastPrimaryDocument != nil {
                Button("Open Decrypted Manual") {
                    model.openPrimaryDocument()
                }
                .buttonStyle(.borderedProminent)
                .tint(Color(red: 0.20, green: 0.39, blue: 0.42))
            }

            if model.lastOutputDirectory != nil {
                Button("Reveal Output Folder") {
                    model.openOutputDirectory()
                }
                .buttonStyle(.bordered)
            }
        }
    }

    private var expandedStatusPanel: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 8) {
                Image(systemName: model.statusSymbolName)
                    .foregroundStyle(model.statusAccentColor)
                Text(model.statusTitle)
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.78))
            }

            Text(model.statusMessage)
                .font(.system(size: 12, weight: .medium, design: .monospaced))
                .foregroundStyle(Color.black.opacity(0.72))
                .frame(maxWidth: .infinity, alignment: .leading)
                .textSelection(.enabled)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(model.statusAccentColor.opacity(0.10))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(model.statusAccentColor.opacity(0.30), lineWidth: 1)
        )
    }

    private var cardBackground: some View {
        RoundedRectangle(cornerRadius: 26, style: .continuous)
            .fill(Color.white.opacity(0.46))
            .overlay(
                RoundedRectangle(cornerRadius: 26, style: .continuous)
                    .stroke(Color.white.opacity(0.8), lineWidth: 1)
            )
            .shadow(color: Color.black.opacity(0.08), radius: 18, x: 0, y: 14)
    }
}

private struct WorkflowPill: View {
    let number: String
    let title: String
    let detail: String

    var body: some View {
        HStack(spacing: 10) {
            Text(number)
                .font(.system(size: 13, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
                .frame(width: 26, height: 26)
                .background(
                    Circle()
                        .fill(Color.black.opacity(0.68))
                )

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.75))
                Text(detail)
                    .font(.system(size: 11, weight: .medium, design: .rounded))
                    .foregroundStyle(Color.black.opacity(0.64))
                    .lineLimit(2)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer(minLength: 0)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.white.opacity(0.55))
        )
    }
}

private struct PathRow: View {
    let title: String
    let subtitle: String
    let value: String?
    let placeholder: String
    let accent: Color
    let browseTitle: String
    var isDropTargeted = false
    var clearTitle: String?
    let onBrowse: () -> Void
    var onClear: (() -> Void)?

    init(
        title: String,
        subtitle: String,
        value: String?,
        placeholder: String,
        accent: Color,
        browseTitle: String,
        isDropTargeted: Bool = false,
        clearTitle: String? = nil,
        onBrowse: @escaping () -> Void,
        onClear: (() -> Void)? = nil
    ) {
        self.title = title
        self.subtitle = subtitle
        self.value = value
        self.placeholder = placeholder
        self.accent = accent
        self.browseTitle = browseTitle
        self.isDropTargeted = isDropTargeted
        self.clearTitle = clearTitle
        self.onBrowse = onBrowse
        self.onClear = onClear
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .foregroundStyle(Color.black.opacity(0.76))

            Text(subtitle)
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundStyle(Color.black.opacity(0.66))

            HStack(spacing: 12) {
                HStack(alignment: .top, spacing: 10) {
                    Circle()
                        .fill(accent)
                        .frame(width: 10, height: 10)
                        .padding(.top, 4)

                    Text(value ?? placeholder)
                        .font(.system(size: 12, weight: .medium, design: .monospaced))
                        .foregroundStyle(value == nil ? Color.black.opacity(0.58) : Color.black.opacity(0.80))
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .textSelection(.enabled)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .fill(isDropTargeted ? accent.opacity(0.18) : Color.white.opacity(0.74))
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .stroke(isDropTargeted ? accent.opacity(0.85) : Color.clear, lineWidth: 2)
                )

                Button(browseTitle, action: onBrowse)
                    .buttonStyle(SmallActionButtonStyle(fill: accent))

                if let clearTitle, let onClear {
                    Button(clearTitle, action: onClear)
                        .buttonStyle(.borderless)
                        .foregroundStyle(Color.black.opacity(0.68))
                }
            }
        }
    }
}

private struct ActionButtonStyle: ButtonStyle {
    let fill: Color

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(.white)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(fill.opacity(configuration.isPressed ? 0.82 : 1))
            )
            .scaleEffect(configuration.isPressed ? 0.99 : 1)
    }
}

private struct SmallActionButtonStyle: ButtonStyle {
    let fill: Color

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 12, weight: .bold, design: .rounded))
            .foregroundStyle(.white)
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(
                Capsule()
                    .fill(fill.opacity(configuration.isPressed ? 0.82 : 1))
            )
    }
}

final class ContentViewModel: ObservableObject {
    enum PickerTarget {
        case input
        case output
        case commonE2
    }

    @Published var inputDirectory: URL?
    @Published var outputDirectory: URL?
    @Published var commonE2Directory: URL?
    @Published var isInPlace = false
    @Published var isProcessing = false
    @Published var isPickingFolder = false
    @Published var progress: Double = 0
    @Published var progressLabel = "Ready"
    @Published var statusTitle = "Ready"
    @Published var statusMessage = "Choose a manual folder to begin."
    @Published var logLines = [
        "Native Swift port ready.",
        "Select a FujiFilm EDOC manual folder to start."
    ]
    @Published var resultSummary: String?

    var lastOutputDirectory: URL?
    var lastPrimaryDocument: URL?
    var lastAccessRootDirectory: URL?
    private var pickerTarget: PickerTarget?

    var showsExpandedStatus: Bool {
        statusTitle == "Failed" || statusTitle == "Completed With Issues"
    }

    var statusSymbolName: String {
        switch statusTitle {
        case "Failed":
            return "xmark.octagon.fill"
        case "Completed With Issues":
            return "exclamationmark.triangle.fill"
        default:
            return "info.circle.fill"
        }
    }

    var statusAccentColor: Color {
        switch statusTitle {
        case "Failed":
            return Color.red
        case "Completed With Issues":
            return Color.orange
        default:
            return Color.blue
        }
    }

    func beginPicking(_ target: PickerTarget) {
        pickerTarget = target
        isPickingFolder = true
    }

    func handleFolderSelection(_ result: Result<[URL], Error>) {
        guard case let .success(urls) = result, let url = urls.first, let pickerTarget else {
            return
        }

        switch pickerTarget {
        case .input:
            inputDirectory = url
        case .output:
            outputDirectory = url
        case .commonE2:
            commonE2Directory = url
        }

        self.pickerTarget = nil
    }

    func startProcessing() {
        guard let inputDirectory else {
            appendLog("Input folder is required.")
            statusTitle = "Missing Input"
            statusMessage = "Select the EDOC manual folder first."
            return
        }

        if !FileManager.default.fileExists(atPath: inputDirectory.path) {
            appendLog("Input folder does not exist: \(inputDirectory.path)")
            statusTitle = "Invalid Input"
            statusMessage = "The selected manual folder could not be found."
            return
        }

        if !isInPlace, outputDirectory == nil {
            appendLog("Output folder is required for sandboxed builds when not using in-place mode.")
            statusTitle = "Choose Output Folder"
            statusMessage = "Select an output folder in Advanced Options, or enable in-place mode."
            return
        }

        isProcessing = true
        progress = 0
        progressLabel = "Preparing…"
        statusTitle = "Working"
        statusMessage = "Decrypting and modernizing the manual."
        resultSummary = nil
        lastOutputDirectory = nil
        lastPrimaryDocument = nil
        lastAccessRootDirectory = nil
        logLines.removeAll()
        appendLog("Starting native Swift EDOC conversion.")

        let configuration = EDOCProcessor.Configuration(
            inputDirectory: inputDirectory,
            outputDirectory: isInPlace ? nil : outputDirectory,
            inPlace: isInPlace,
            commonE2Directory: commonE2Directory
        )

        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self else { return }

            let processor = EDOCProcessor(
                logHandler: { message in
                    DispatchQueue.main.async {
                        self.appendLog(message)
                    }
                },
                progressHandler: { current, total, label in
                    DispatchQueue.main.async {
                        self.progress = total == 0 ? 0 : Double(current) / Double(total)
                        self.progressLabel = label
                    }
                }
            )

            do {
                let result = try processor.run(configuration)
                DispatchQueue.main.async {
                    self.isProcessing = false
                    self.lastOutputDirectory = result.outputDirectory
                    self.lastPrimaryDocument = result.entryDocument
                    self.lastAccessRootDirectory = result.accessRootDirectory
                    self.progress = 1
                    self.progressLabel = "Processed \(result.processed) of \(result.total) actionable files"
                    self.statusTitle = result.errors.isEmpty ? "Complete" : "Completed With Issues"
                    self.statusMessage = result.errors.isEmpty
                        ? "Output is ready."
                        : "\(result.errors.count) item(s) need attention."
                    self.resultSummary = result.errors.isEmpty
                        ? "\(result.processed)/\(result.total) complete"
                        : "\(result.errors.count) warning(s)"
                }
            } catch {
                DispatchQueue.main.async {
                    self.isProcessing = false
                    self.progress = 0
                    self.progressLabel = "Failed"
                    self.statusTitle = "Failed"
                    self.statusMessage = error.localizedDescription
                    self.appendLog("Fatal error: \(error.localizedDescription)")
                }
            }
        }
    }

    func handleDroppedFolders(_ urls: [URL]) -> Bool {
        guard let folderURL = urls.first(where: isAcceptableManualFolder(_:)) else {
            appendLog("Dropped item was ignored. Drop the EDOC `manual/` folder.")
            statusTitle = "Invalid Drop"
            statusMessage = "Drop the manual directory itself, not an individual file."
            return false
        }

        inputDirectory = folderURL
        statusTitle = "Ready"
        statusMessage = "Manual folder selected from drag and drop."
        appendLog("Selected input from drop: \(folderURL.path)")
        return true
    }

    func openOutputDirectory() {
        guard let lastOutputDirectory else { return }
        openWithSecurityScope(lastOutputDirectory, accessRoot: lastAccessRootDirectory)
    }

    func openPrimaryDocument() {
        guard let lastPrimaryDocument else { return }
        openWithSecurityScope(lastPrimaryDocument, accessRoot: lastAccessRootDirectory)
    }

    private func appendLog(_ line: String) {
        logLines.append(line)
    }

    private func openWithSecurityScope(_ url: URL, accessRoot: URL?) {
        let rootURL = accessRoot ?? url
        let didStartRoot = rootURL.startAccessingSecurityScopedResource()
        let didStartURL = url.startAccessingSecurityScopedResource()
        defer {
            if didStartURL {
                url.stopAccessingSecurityScopedResource()
            }
            if didStartRoot {
                rootURL.stopAccessingSecurityScopedResource()
            }
        }
        NSWorkspace.shared.open(url)
    }

    private func isAcceptableManualFolder(_ url: URL) -> Bool {
        var isDirectory: ObjCBool = false
        guard FileManager.default.fileExists(atPath: url.path, isDirectory: &isDirectory), isDirectory.boolValue else {
            return false
        }

        if url.lastPathComponent.lowercased() == "manual" {
            return true
        }

        let likelyEDOCEntries = ["header.html", "doc.html", "menu.html", "zenbunresult.html"]
        return likelyEDOCEntries.contains { name in
            FileManager.default.fileExists(atPath: url.appendingPathComponent(name).path)
        }
    }
}

private final class EDOCProcessor {
    struct Configuration {
        let inputDirectory: URL
        let outputDirectory: URL?
        let inPlace: Bool
        let commonE2Directory: URL?
    }

    struct Result {
        let outputDirectory: URL
        let entryDocument: URL?
        let accessRootDirectory: URL?
        let processed: Int
        let total: Int
        let errors: [String]
    }

    private enum PageType {
        case encrypted
        case unencrypted
        case header
        case support
    }

    private let logHandler: (String) -> Void
    private let progressHandler: (Int, Int, String) -> Void
    private let fileManager = FileManager.default

    private let tableBorderCSS = """
    <style type="text/css">
    /* Injected by the Swift macOS app */
    table { border: 2px solid #333; border-collapse: collapse; }
    table td, table th { border: 1px solid #999; padding: 4px; }
    </style>
    """

    private let jumpLinkReplacement = """
    function jumpLink() {
    \tvar prodSel = document.manual.product;
    \tvar chapSel = document.manual.chap;
    \tvar prodValue = prodSel.options[prodSel.selectedIndex].value;
    \tvar chapValue = chapSel.options[chapSel.selectedIndex].value;
    \tvar base = location.href.substring(0, location.href.lastIndexOf('/') + 1);
    \tif (prodValue != "") {
    \t\tvar URL = base + "../../" + prodValue + "/manual/" + prodValue + ".htm";
    \t\tif (chapValue != "") {
    \t\t\tURL += "?" + prodValue + "&" + chapValue;
    \t\t}
    \t\twindow.top.location.href = URL;
    \t} else if (chapValue != "") {
    \t\ttop.doc.main.location.href = base + chapValue + ".html";
    \t}
    }
    """

    private let runZenbunReplacement = """
    function runzenbun(){
    \tvar q = document.getElementById('txtzenbun').value;
    \tif (!q) return false;
    \tvar base = location.href.substring(0, location.href.lastIndexOf('/') + 1);
    \ttop.doc.main.location.href = base + "zenbunresult.html?q=" + encodeURIComponent(q);
    \treturn false;
    }
    """

    private let searchOverrideScript = """
    <script type="text/javascript">
    // Injected by the Swift macOS app to support offline file:// search
    (function() {
    \tvar originalOnload = window.onload;
    \twindow.onload = function() {
    \t\tvar searchText = '';
    \t\tvar qMatch = location.search.match(/[?&]q=([^&]*)/);
    \t\tif (qMatch) searchText = decodeURIComponent(qMatch[1]);

    \t\tif (!searchText) {
    \t\t\ttry { searchText = top.header.document.getElementById('txtzenbun').value; } catch(e) {}
    \t\t}

    \t\tif (!searchText) return;

    \t\ttry { initialize(); } catch(e) {}
    \t\ttry { searchMenu(); } catch(e) {}

    \t\tvar elmResultCount = document.getElementById('resultcount');
    \t\tvar resultState = elmResultCount.parentNode;
    \t\tresultState.innerHTML = 'Searching...';
    \t\tresultState.setAttribute('id', 'resultState');

    \t\tvar script = document.getElementById('zenbunidx');
    \t\tscript.src = 'zenbunidx/zenbun.idx.js';

    \t\tonLoadScript(script, function() {
    \t\t\tsetTimeout(function() {
    \t\t\t\ttry {
    \t\t\t\t\tselectZenbunIdxData(gZenbunIdx, searchText, 'resultcount', 'resultol');
    \t\t\t\t} catch(e) {
    \t\t\t\t\tdocument.getElementById('resultState').innerHTML = 'Error: ' + e.message;
    \t\t\t\t}
    \t\t\t}, 500);
    \t\t});
    \t};
    })();
    </script>
    """

    init(
        logHandler: @escaping (String) -> Void,
        progressHandler: @escaping (Int, Int, String) -> Void
    ) {
        self.logHandler = logHandler
        self.progressHandler = progressHandler
    }

    func run(_ configuration: Configuration) throws -> Result {
        let inputDirectory = configuration.inputDirectory.standardizedFileURL
        let outputDirectory: URL

        guard fileManager.fileExists(atPath: inputDirectory.path) else {
            throw ProcessingError.message("Input directory does not exist: \(inputDirectory.path)")
        }

        if configuration.inPlace {
            outputDirectory = inputDirectory
        } else if let explicitOutput = configuration.outputDirectory?.standardizedFileURL {
            outputDirectory = explicitOutput
        } else {
            outputDirectory = inputDirectory.deletingLastPathComponent()
                .appendingPathComponent("\(inputDirectory.lastPathComponent)_decrypted", isDirectory: true)
        }

        return try withSecurityScopedAccess(
            to: [inputDirectory, configuration.outputDirectory, outputDirectory, configuration.commonE2Directory]
        ) {
            if !configuration.inPlace {
                if configuration.outputDirectory != nil {
                    var isDirectory: ObjCBool = false
                    if fileManager.fileExists(atPath: outputDirectory.path, isDirectory: &isDirectory) {
                        guard isDirectory.boolValue else {
                            throw ProcessingError.message("Output path is not a directory: \(outputDirectory.path)")
                        }

                        let contents = try fileManager.contentsOfDirectory(
                            at: outputDirectory,
                            includingPropertiesForKeys: nil,
                            options: [.skipsHiddenFiles]
                        )
                        if !contents.isEmpty {
                            throw ProcessingError.message("Output directory must be empty: \(outputDirectory.path)")
                        }
                    } else {
                        try fileManager.createDirectory(
                            at: outputDirectory,
                            withIntermediateDirectories: true,
                            attributes: nil
                        )
                    }
                } else if fileManager.fileExists(atPath: outputDirectory.path) {
                    throw ProcessingError.message("Output directory already exists: \(outputDirectory.path)")
                }

                log("Copying source tree to \(outputDirectory.path)")
                try copyDirectoryContents(from: inputDirectory, to: outputDirectory)
            }

            log("Scanning HTML files…")
            let classified = try discoverFiles(in: inputDirectory)
            let encrypted = classified[.encrypted] ?? []
            let unencrypted = classified[.unencrypted] ?? []
            let headers = classified[.header] ?? []
            let support = classified[.support] ?? []
            let totalWork = encrypted.count + unencrypted.count + headers.count

            log("Found \(encrypted.count) encrypted, \(unencrypted.count) unencrypted, \(headers.count) header, \(support.count) support pages")

            try copyCommonE2IfNeeded(
                from: inputDirectory,
                to: outputDirectory,
                overrideDirectory: configuration.commonE2Directory
            )

            var processed = 0
            var success = 0
            var errors: [String] = []

            for htmlPath in encrypted.sorted(by: { $0.path < $1.path }) {
                processed += 1
                let outputPath = configuration.inPlace ? htmlPath : outputDirectory.appending(path: relativePath(of: htmlPath, from: inputDirectory))
                let datPath = htmlPath.deletingPathExtension().appendingPathExtension("dat")

                progressHandler(processed, totalWork, "[\(processed)/\(totalWork)] Decrypting \(htmlPath.lastPathComponent)")

                guard fileManager.fileExists(atPath: datPath.path) else {
                    let message = "Missing .dat for \(htmlPath.lastPathComponent)"
                    log(message)
                    errors.append(message)
                    continue
                }

                do {
                    try processEncryptedPage(htmlPath: htmlPath, datPath: datPath, outputPath: outputPath)
                    success += 1
                } catch {
                    let message = "Failed \(htmlPath.lastPathComponent): \(error.localizedDescription)"
                    log(message)
                    errors.append(message)
                }
            }

            for htmlPath in unencrypted.sorted(by: { $0.path < $1.path }) {
                processed += 1
                let outputPath = configuration.inPlace ? htmlPath : outputDirectory.appending(path: relativePath(of: htmlPath, from: inputDirectory))
                progressHandler(processed, totalWork, "[\(processed)/\(totalWork)] Cleaning \(htmlPath.lastPathComponent)")

                do {
                    try processUnencryptedPage(htmlPath: htmlPath, outputPath: outputPath)
                    success += 1
                } catch {
                    let message = "Failed \(htmlPath.lastPathComponent): \(error.localizedDescription)"
                    log(message)
                    errors.append(message)
                }
            }

            for htmlPath in headers {
                processed += 1
                let outputPath = configuration.inPlace ? htmlPath : outputDirectory.appending(path: relativePath(of: htmlPath, from: inputDirectory))
                progressHandler(processed, totalWork, "[\(processed)/\(totalWork)] Fixing header")

                do {
                    try processHeader(htmlPath: htmlPath, outputPath: outputPath)
                    success += 1
                } catch {
                    let message = "Failed \(htmlPath.lastPathComponent): \(error.localizedDescription)"
                    log(message)
                    errors.append(message)
                }
            }

            try processSupportFiles(
                support,
                inputDirectory: inputDirectory,
                outputDirectory: outputDirectory,
                inPlace: configuration.inPlace
            )

            let searchPage = outputDirectory.appendingPathComponent("zenbunresult.html")
            if fileManager.fileExists(atPath: searchPage.path) {
                if try processSearchPage(at: searchPage) {
                    log("Patched zenbunresult.html")
                }
            }

            log("============================================================")
            log("EDOC Decryption Complete")
            log("Processed \(success) of \(totalWork) actionable files")
            log("Support pages scanned: \(support.count)")
            log("Warnings: \(errors.count)")
            log("Output: \(outputDirectory.path)")
            log("============================================================")

            return Result(
                outputDirectory: outputDirectory,
                entryDocument: findEntryDocument(in: outputDirectory),
                accessRootDirectory: configuration.outputDirectory ?? (configuration.inPlace ? inputDirectory : outputDirectory),
                processed: success,
                total: totalWork,
                errors: errors
            )
        }
    }

    private func discoverFiles(in manualDirectory: URL) throws -> [PageType: [URL]] {
        var classified: [PageType: [URL]] = [
            .encrypted: [],
            .unencrypted: [],
            .header: [],
            .support: []
        ]

        guard let enumerator = fileManager.enumerator(
            at: manualDirectory,
            includingPropertiesForKeys: [.isRegularFileKey],
            options: [.skipsHiddenFiles]
        ) else {
            throw ProcessingError.message("Unable to scan \(manualDirectory.path)")
        }

        for case let fileURL as URL in enumerator {
            let pathExtension = fileURL.pathExtension.lowercased()
            guard pathExtension == "html" || pathExtension == "htm" else { continue }

            let pageType = classifyHTML(at: fileURL)
            classified[pageType, default: []].append(fileURL)
        }

        return classified
    }

    private func classifyHTML(at fileURL: URL) -> PageType {
        if fileURL.lastPathComponent == "header.html" {
            return .header
        }

        guard let prefix = try? readPrefix(of: fileURL, limit: 4096) else {
            return .support
        }

        if prefix.contains("decryptHtmlUTF8") {
            return .encrypted
        }

        if prefix.contains("<!--$objcrypt;-->") || prefix.contains("<!-- #main") {
            return .unencrypted
        }

        return .support
    }

    private func readPrefix(of fileURL: URL, limit: Int) throws -> String {
        let handle = try FileHandle(forReadingFrom: fileURL)
        defer { try? handle.close() }
        let data = try handle.read(upToCount: limit) ?? Data()
        return String(decoding: data, as: UTF8.self)
    }

    private func decryptDAT(at fileURL: URL) throws -> Data {
        var raw = Array(try Data(contentsOf: fileURL))

        for index in raw.indices {
            let key: UInt8 = index.isMultiple(of: 2) ? 0x93 : 0xAC
            raw[index] = raw[index] ^ UInt8(index & 0xFF) ^ key
        }

        let header = Data(raw.prefix(10))
        guard
            let outputSizeString = String(data: header, encoding: .utf8)?
                .trimmingCharacters(in: .whitespacesAndNewlines),
            let outputSize = Int(outputSizeString)
        else {
            throw ProcessingError.message("Bad header in \(fileURL.lastPathComponent)")
        }

        var buffer = Array<UInt8>(repeating: 0x20, count: 4096)
        var bufferPosition = 0xFF0
        var output: [UInt8] = []
        var position = 9
        var flags = 0

        while output.count < outputSize {
            flags >>= 1

            if (flags & 0x100) == 0 {
                position += 1
                if position >= raw.count { break }
                flags = Int(raw[position]) | 0xFF00
            }

            position += 1
            if position >= raw.count { break }

            if (flags & 1) == 1 {
                let byte = raw[position]
                output.append(byte)
                buffer[bufferPosition] = byte
                bufferPosition = (bufferPosition + 1) & 0x0FFF
            } else {
                if position + 1 >= raw.count { break }
                let b1 = Int(raw[position])
                position += 1
                let b2 = Int(raw[position])
                let referencePosition = b1 | ((b2 & 0xF0) << 4)
                let length = (b2 & 0x0F) + 3

                for offset in 0..<length where output.count < outputSize {
                    let byte = buffer[(referencePosition + offset) & 0x0FFF]
                    output.append(byte)
                    buffer[bufferPosition] = byte
                    bufferPosition = (bufferPosition + 1) & 0x0FFF
                }
            }
        }

        return Data(output)
    }

    private func processEncryptedPage(htmlPath: URL, datPath: URL, outputPath: URL) throws {
        var html = try String(contentsOf: htmlPath, encoding: .utf8)
        let decryptedContent = String(decoding: try decryptDAT(at: datPath), as: UTF8.self)

        html = replacingMatches(
            in: html,
            pattern: #"<object\s+id=["']fxedoc["'][^>]*></object>\s*\n?"#,
            options: [.caseInsensitive]
        ) { _ in "" }

        let mainBlockPattern = #"(<!-- #main\b[^-]*?-->)\s*\n.*?(<!-- / #main\b[^-]*?-->)"#
        let replacedMain = replaceFirstMatch(
            in: html,
            pattern: mainBlockPattern,
            options: [.dotMatchesLineSeparators]
        ) { _, groups in
            "\(groups[1])\n\(decryptedContent)\n\(groups[2])"
        }

        if replacedMain.didReplace {
            html = replacedMain.output
        } else {
            let scriptPattern = #"<script[^>]*>\s*<!--\s*\n?\s*fxedoc\.Url.*?decryptHtmlUTF8\(\).*?-->\s*</script>"#
            let fallback = replaceFirstMatch(
                in: html,
                pattern: scriptPattern,
                options: [.dotMatchesLineSeparators]
            ) { _, _ in
                decryptedContent
            }

            guard fallback.didReplace else {
                throw ProcessingError.message("No injection markers found in \(htmlPath.lastPathComponent)")
            }

            html = fallback.output
        }

        html = injectTableCSS(into: html)
        html = fixCommonE2Paths(in: html)
        try write(html, to: outputPath)
    }

    private func processUnencryptedPage(htmlPath: URL, outputPath: URL) throws {
        var html = try String(contentsOf: htmlPath, encoding: .utf8)
        html = html.replacingOccurrences(of: "<!--$objcrypt;-->\n", with: "")
        html = html.replacingOccurrences(of: "<!--$objcrypt;-->", with: "")
        html = injectTableCSS(into: html)
        html = fixCommonE2Paths(in: html)
        try write(html, to: outputPath)
    }

    private func processHeader(htmlPath: URL, outputPath: URL) throws {
        var html = try String(contentsOf: htmlPath, encoding: .utf8)

        html = replacingMatches(
            in: html,
            pattern: #"<object\s+id=["']login["'][^>]*></object>\s*\n?"#,
            options: [.caseInsensitive]
        ) { _ in "" }

        html = replacingMatches(
            in: html,
            pattern: #"<a\s+id=["']opfx["'][^>]*>.*?</a>"#,
            options: [.dotMatchesLineSeparators, .caseInsensitive]
        ) { _ in "" }

        html = replacingMatches(
            in: html,
            pattern: #"function jumpLink\(\)\s*\{.*?\n\}"#,
            options: [.dotMatchesLineSeparators]
        ) { _ in
            jumpLinkReplacement
        }

        html = replacingMatches(
            in: html,
            pattern: #"function runzenbun\(\)\s*\{.*?\n\}"#,
            options: [.dotMatchesLineSeparators]
        ) { _ in
            runZenbunReplacement
        }

        html = html.replacingOccurrences(
            of: "width:200px;ime-mode:active",
            with: "width:300px;ime-mode:active"
        )

        let headerCSS = """
        <style type="text/css">
        body { margin: 0; padding: 0; }
        #header { margin: 0; height: 100%; box-sizing: border-box; padding: 0 5px; }
        </style>
        """

        if html.contains("</head>") {
            html = html.replacingOccurrences(of: "</head>", with: "\(headerCSS)\n</head>", options: .literal, range: html.startIndex..<html.endIndex)
        }

        html = fixCommonE2Paths(in: html)
        try write(html, to: outputPath)
    }

    private func processSupportFiles(
        _ supportFiles: [URL],
        inputDirectory: URL,
        outputDirectory: URL,
        inPlace: Bool
    ) throws {
        for htmlPath in supportFiles.sorted(by: { $0.path < $1.path }) {
            let outputPath = inPlace ? htmlPath : outputDirectory.appending(path: relativePath(of: htmlPath, from: inputDirectory))

            do {
                var html = try String(contentsOf: htmlPath, encoding: .utf8)
                var didModify = false

                if html.contains("common_e2") {
                    html = fixCommonE2Paths(in: html)
                    didModify = true
                }

                if html.contains(#"rows="75,*,40""#) {
                    html = html.replacingOccurrences(of: #"rows="75,*,40""#, with: #"rows="90,*,40""#)
                    didModify = true
                }

                if didModify {
                    try write(html, to: outputPath)
                }
            } catch {
                log("Skipped support page \(htmlPath.lastPathComponent): \(error.localizedDescription)")
            }
        }
    }

    private func processSearchPage(at outputPath: URL) throws -> Bool {
        var html = try String(contentsOf: outputPath, encoding: .utf8)
        let marker = #"<script type="text/javascript" id="zenbunidx"></script>"#

        guard html.contains(marker) else {
            return false
        }

        html = html.replacingOccurrences(of: marker, with: "\(marker)\n\(searchOverrideScript)")
        try write(html, to: outputPath)
        return true
    }

    private func copyCommonE2IfNeeded(from inputDirectory: URL, to outputDirectory: URL, overrideDirectory: URL?) throws {
        let destination = outputDirectory.appendingPathComponent("common_e2", isDirectory: true)
        guard !fileManager.fileExists(atPath: destination.path) else {
            return
        }

        let candidates: [URL?] = [
            overrideDirectory?.standardizedFileURL,
            inputDirectory.deletingLastPathComponent().appendingPathComponent("common_e2", isDirectory: true),
            inputDirectory.deletingLastPathComponent().deletingLastPathComponent().appendingPathComponent("common_e2", isDirectory: true),
            Bundle.main.resourceURL?.appendingPathComponent("common_e2", isDirectory: true)
        ]

        if let source = candidates.compactMap({ candidate -> URL? in
            guard let candidate else { return nil }
            return fileManager.fileExists(atPath: candidate.path) ? candidate : nil
        }).first {
            log("Copying common_e2 from \(source.path)")
            try copyDirectoryContents(from: source, to: destination)
        } else {
            log("Warning: common_e2 was not found. CSS and images may be incomplete.")
        }
    }

    private func copyDirectoryContents(from source: URL, to destination: URL) throws {
        try fileManager.createDirectory(
            at: destination,
            withIntermediateDirectories: true,
            attributes: nil
        )

        guard let enumerator = fileManager.enumerator(
            at: source,
            includingPropertiesForKeys: [.isDirectoryKey],
            options: [.skipsHiddenFiles]
        ) else {
            throw ProcessingError.message("Unable to enumerate \(source.lastPathComponent)")
        }

        for case let itemURL as URL in enumerator {
            let relativeComponent = itemURL.path.replacingOccurrences(of: source.path + "/", with: "")
            let targetURL = destination.appendingPathComponent(relativeComponent)

            let resourceValues = try itemURL.resourceValues(forKeys: [.isDirectoryKey])
            if resourceValues.isDirectory == true {
                try fileManager.createDirectory(
                    at: targetURL,
                    withIntermediateDirectories: true,
                    attributes: nil
                )
            } else {
                try fileManager.createDirectory(
                    at: targetURL.deletingLastPathComponent(),
                    withIntermediateDirectories: true,
                    attributes: nil
                )
                let data = try Data(contentsOf: itemURL)
                try data.write(to: targetURL, options: .atomic)
            }
        }
    }

    private func injectTableCSS(into html: String) -> String {
        guard html.contains("</head>") else { return html }
        return html.replacingOccurrences(of: "</head>", with: "\(tableBorderCSS)\n</head>", options: .literal, range: html.startIndex..<html.endIndex)
    }

    private func fixCommonE2Paths(in html: String) -> String {
        html
            .replacingOccurrences(of: "../../../common_e2/", with: "../common_e2/")
            .replacingOccurrences(of: "../../common_e2/", with: "./common_e2/")
    }

    private func write(_ string: String, to outputPath: URL) throws {
        try fileManager.createDirectory(
            at: outputPath.deletingLastPathComponent(),
            withIntermediateDirectories: true,
            attributes: nil
        )
        try string.write(to: outputPath, atomically: true, encoding: .utf8)
    }

    private func relativePath(of fileURL: URL, from rootURL: URL) -> String {
        let filePath = fileURL.standardizedFileURL.path
        let rootPath = rootURL.standardizedFileURL.path.hasSuffix("/") ? rootURL.standardizedFileURL.path : rootURL.standardizedFileURL.path + "/"
        return String(filePath.dropFirst(rootPath.count))
    }

    private func withSecurityScopedAccess<T>(to urls: [URL?], operation: () throws -> T) throws -> T {
        let scopedURLs = urls.compactMap { $0?.standardizedFileURL }
        var accessedURLs: [URL] = []

        for url in scopedURLs where url.startAccessingSecurityScopedResource() {
            accessedURLs.append(url)
        }

        defer {
            for url in accessedURLs {
                url.stopAccessingSecurityScopedResource()
            }
        }

        return try operation()
    }

    private func findEntryDocument(in outputDirectory: URL) -> URL? {
        let candidates = [
            outputDirectory.lastPathComponent.replacingOccurrences(of: "_decrypted", with: "") + ".htm",
            outputDirectory.lastPathComponent.replacingOccurrences(of: "_decrypted", with: "") + ".html"
        ]

        for candidate in candidates {
            let url = outputDirectory.appendingPathComponent(candidate)
            if fileManager.fileExists(atPath: url.path) {
                return url
            }
        }

        guard let items = try? fileManager.contentsOfDirectory(
            at: outputDirectory,
            includingPropertiesForKeys: nil,
            options: [.skipsHiddenFiles]
        ) else {
            return nil
        }

        let ignoredNames = Set(["header.html", "doc.html", "footer.html", "menu.html", "zenbunresult.html"])

        return items
            .filter { url in
                let ext = url.pathExtension.lowercased()
                return ext == "htm" || ext == "html"
            }
            .filter { !ignoredNames.contains($0.lastPathComponent.lowercased()) }
            .sorted { $0.lastPathComponent < $1.lastPathComponent }
            .first
    }

    private func replacingMatches(
        in string: String,
        pattern: String,
        options: NSRegularExpression.Options = [],
        replacement: (NSTextCheckingResult) -> String
    ) -> String {
        guard let regex = try? NSRegularExpression(pattern: pattern, options: options) else {
            return string
        }

        let matches = regex.matches(in: string, range: NSRange(string.startIndex..., in: string))
        guard !matches.isEmpty else { return string }

        let mutable = NSMutableString(string: string)
        for match in matches.reversed() {
            mutable.replaceCharacters(in: match.range, with: replacement(match))
        }

        return mutable as String
    }

    private func replaceFirstMatch(
        in string: String,
        pattern: String,
        options: NSRegularExpression.Options = [],
        replacement: (NSTextCheckingResult, [String]) -> String
    ) -> (output: String, didReplace: Bool) {
        guard let regex = try? NSRegularExpression(pattern: pattern, options: options) else {
            return (string, false)
        }

        guard let match = regex.firstMatch(in: string, range: NSRange(string.startIndex..., in: string)) else {
            return (string, false)
        }

        let groups = (0..<match.numberOfRanges).map { index -> String in
            let range = match.range(at: index)
            guard let swiftRange = Range(range, in: string) else { return "" }
            return String(string[swiftRange])
        }

        let mutable = NSMutableString(string: string)
        mutable.replaceCharacters(in: match.range, with: replacement(match, groups))
        return (mutable as String, true)
    }

    private func log(_ message: String) {
        logHandler(message)
    }

    private enum ProcessingError: LocalizedError {
        case message(String)

        var errorDescription: String? {
            switch self {
            case let .message(message):
                return message
            }
        }
    }
}

#Preview {
    ContentView()
}
